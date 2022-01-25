<template>
  <div class="fit col">
    <q-scroll-area class="fit">
      <h5 class="q-pa-md">
        New Multi-track Recording
      </h5>
      <h6 class="text-bold font-navy text-overline q-px-sm">
        Meeting Details
      </h6>
      <div>
        <div class="q-my-md">
          <q-input
            label="Title"
            standout="bg-navy text-white"
            v-model="newMeeting.name"
            class="shadow-2"
          />
        </div>
        <q-uploader
          multiple
          accept="audio/wav"
          label="Upload Recording Tracks"
          @added="filesAdded"
          @removed="filesRemoved"
          hide-upload-btn
          class="full-width q-ma-none"
          bordered
        >
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm bg-navy rounded-borders">
              <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
                <q-tooltip>Clear All</q-tooltip>
              </q-btn>
              <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
                <q-tooltip>Remove Uploaded Files</q-tooltip>
              </q-btn>
              <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
              <div class="col">
                <div class="q-uploader__title text-uppercase">Add Tracks ({{scope.files.length}} Tracks)</div>
                <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
              </div>
              <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" round dense flat>
                <q-uploader-add-trigger />
                <q-tooltip>Pick Files</q-tooltip>
              </q-btn>
              <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
                <q-tooltip>Abort Upload</q-tooltip>
              </q-btn>
            </div>
          </template>
          <template v-slot:list="scope">
            <q-list class="q-ma-none">
              <q-item v-for="file in filesList" :key="file.name" class="q-pa-none">
                <q-item-section>
                  <q-chip
                    class="fit q-my-xs"
                    square
                  >
                    <q-linear-progress
                      class="absolute-full full-height"
                      :value="file.progress"
                      :color="statusColor(file.state)"
                      track-color="grey-2"
                    />

                    <q-avatar>
                      <q-icon name="audiotrack" />
                    </q-avatar>

                    <div class="ellipsis relative-position">
                      {{ file.name }}
                    </div>

                    <q-tooltip>
                      {{ file.name }}
                    </q-tooltip>
                  </q-chip>
                </q-item-section>
                <!-- <q-item-section>
                  <q-item-label class="full-width ellipsis">
                    {{ file.name }}
                  </q-item-label>

                  <q-item-label caption>
                    Status: {{ file.state }}
                  </q-item-label>

                  <q-item-label caption>
                    {{ file.progress }}
                  </q-item-label>
                </q-item-section> -->

                <q-item-section top side>
                  <q-btn
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file.file)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-uploader>
        <h6 class="text-bold font-navy text-overline q-px-sm q-my-md">
          Notifications
        </h6>
        <q-select
          label="Notify when Transcription has ended"
          v-model="newMeeting.recepients"
          use-input
          use-chips
          multiple
          color="navy"
          class="font-navy"
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
        />
        <q-btn label="Transcribe" size="md" push rounded text-color="navy" class="q-my-md font-navy" @click="startUpload" />
      </div>
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watchEffect, onMounted } from '@vue/composition-api'
import { UploadService } from '../services/firebase'
import { WavFileUpload } from '../services/fileUpload'
import { recordingService } from '../services/recordingsService'
import { AuthService, DbService } from '../services/firebase'
import { date } from 'quasar'

export default defineComponent({
  name: 'NewMeetingComponent',
  setup() {
    const filesList = ref(<WavFileUpload[]>[])
    const { uploadFactoryFn } = UploadService()
    const { newRecording } = recordingService()
    const { createMeeting, initFiles } = DbService()
    const { userid } = AuthService()
    const newMeeting = reactive({
      name: '',
      created: '',
      numTracks: 0,
      totalSize: 0,
      uploads: <string[]>[],
      recepients: <string[]>[],
      user: '',
      summary: ''
    })
    onMounted(async () => {
      newMeeting.user = await userid() as string
    })
    watchEffect(() => {
      const uploadProgress = filesList.value.map(a => a.downloadURL).filter(Boolean).length
      if (uploadProgress > 0 && uploadProgress == filesList.value.length) {
        console.log(newMeeting)
        void newRecording(newMeeting)
        void createMeeting(newMeeting)
        void initFiles(newMeeting, filesList.value)
      }
    })
    const filesAdded = (files: File[]) => {
      filesList.value.push(...files.map((file) => new WavFileUpload(file)))
      newMeeting.numTracks = filesList.value.length
      console.log(filesList.value)
    }
    const filesRemoved = (files: File[]) => {
      files.forEach((file) => {
        const idx = filesList.value.findIndex((f) => f.name = file.name)
        filesList.value.splice(idx, 1)
        console.log(filesList.value)
        newMeeting.numTracks = filesList.value.length
      })
    }
    const startUpload = () => {
      newMeeting.numTracks = filesList.value.length
      newMeeting.totalSize = 0
      newMeeting.uploads = []
      newMeeting.created = date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      filesList.value.forEach(file => {
        newMeeting.totalSize += file.size
        newMeeting.uploads.push(file.name)
      })
      console.log(newMeeting)
      filesList.value.map((f) => {
        f.uploadFile()
      })
    }
    const getStatusColor = (status: string) => {
      switch(status) {
        case 'paused':
          return 'grey-4'
        case 'running':
          return 'orange-2'
        case 'Uploaded':
          return 'green'
        default:
          return 'white'
      }
    }
    return {
      uploadFactoryFn,
      filesAdded,
      filesRemoved,
      filesList: computed(() => filesList.value),
      startUpload,
      statusColor: getStatusColor,
      newMeeting
    }
  }
})
</script>