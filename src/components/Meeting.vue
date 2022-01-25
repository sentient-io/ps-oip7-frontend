<template>
  <div class="fit">
    <q-scroll-area class="fit">
      <h5 class="font-navy text-bold">
      {{recording.name}}
      </h5>
      <span class="text-caption font-navy">
        {{formatDate(recording.created)}}
      </span>
      <div class="q-my-md full-width"> </div>
      <div class="q-my-md">
        <div class="text-overline text-weight-bold text-uppercase">
          Details
        </div>
        <div class="text-subtitle2">Number of Tracks: {{recording.numTracks}}</div>
        <div class="text-subtitle2">Total Size: {{humanStorageSize(recording.totalSize)}}</div>
        <div class="text-subtitle2">Notfications:
          <span v-for="email in recording.recepients" :key="email">
            <q-chip color="navy" text-color="white" icon="email">
              {{email}}
            </q-chip>
          </span>
        </div>
        <div class="text-subtitle2">
          Compiled Transcript: <q-btn flat color="navy" icon="file_download" v-if="files.length > 0" @click="downloadFile(files[0]['compiled_transcript'])" />
          <span v-else>Transcribing...</span>
        </div>
        <div class="text-subtitle2">
          Summary: <q-btn flat color="navy" icon="file_download" v-if="files.length > 0" @click="downloadFile(files[0]['summary'])" />
          <span v-else>Summarizing...</span>
        </div>
      </div>
      <q-separator />
      <div class="q-my-md">
        <div class="text-overline text-weight-bold text-uppercase">
          Tracks
        </div>
        <q-table
          :data="tracks"
          :columns="columns"
          row-key="speaker"
          rows
          :pagination="{rowsPerPage: 0}"
          table-header-class="bg-navy text-white text-weight-bold"
        >
          <template v-slot:body-cell-size="props">
            <q-td :props="props">
              <div>
                {{ props.row.size ? humanStorageSize(props.row.size) : 'NA'}}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              <div>
                {{ props.row.uploadedOn ? formatDate(props.row.uploadedOn) : 'NA'}}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-src="props">
            <q-td :props="props">
              <q-btn flat color="navy" icon="file_download" @click="downloadFile(props.row.src)" />
            </q-td>
          </template>
          <template v-slot:body-cell-txtfile="props">
            <q-td :props="props">
              <q-btn flat color="navy" icon="file_download" @click="downloadFile(props.row.txtfile)" v-if="props.row.txtfile" />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from '@vue/composition-api'
import { recordingService } from '../services/recordingsService'
import { DbService, StorageService } from '../services/firebase'
import { date, format } from 'quasar'

const { humanStorageSize } = format
export default defineComponent({
  name: 'MeetingComponent',
  setup() {
    const { recState } = recordingService()
    const { createSnapshot, activeMeeting } = DbService()
    const { downloadFileUrl } = StorageService()
    const snapshot = ref<() => void>()
    const columns = [
      { name: 'speaker', field: 'speaker', required: true, label: 'Speaker', align: 'center', sortable: true },
      { name: 'size', label: 'Size', align: 'center', sortable: true, field: 'size' },
      { name: 'type', field: 'type', label: 'Type', align: 'center', sortable: true },
      { name: 'date', label: 'Uploaded On', align: 'center', field: 'uploadedOn' },
      { name: 'status', field: 'status', label: 'Status', align: 'center', sortable: true },
      { name: 'src', field: 'src', label: 'Source', align: 'center' },
      { name: 'txtfile', field: 'txtfile', label: 'Transcript', align: 'left' }
    ]
    watch(
      () => recState.value.currentRecording.name,
      (currentRecording) => { 
        console.log(currentRecording)
        if (snapshot.value) snapshot.value()
        snapshot.value = createSnapshot(recState.value.currentRecording.name)

      }
    )
    const formatDate = (datestring: string) => {
      return date.formatDate(Date.parse(datestring), 'DD MMM YY h:mm:ss a')
    }
    const downloadFile = async (ref: string) => {
      /* eslint-disable-next-line */
      const url = await downloadFileUrl(ref)
      console.log(url)
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      // xhr.onload = (event) => {
      //   const blob = xhr.response;
      // }
      xhr.open('GET', url);
      xhr.send()
    }
    return {
      recording: computed(() => recState.value.currentRecording),
      formatDate,
      humanStorageSize,
      activeMeeting,
      tracks: computed(() => activeMeeting.value.filter(rec => rec.speaker != 'files')),
      files: computed(() => activeMeeting.value.filter(rec => rec.speaker == 'files')),
      columns,
      downloadFile
    }
  }
})
</script>