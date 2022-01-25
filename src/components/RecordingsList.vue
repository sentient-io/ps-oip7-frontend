<template>
  <div class="fit">
    <q-card flat class="s-rounded-borders full-height bg-base">
      <q-scroll-area class="fit">
        <q-list class="full-width">
          <q-item>
            <q-item-label header class="text-bold font-navy">
              Meeting Recordings
            </q-item-label>
          </q-item>
          <q-item class="full-width">
            <q-item-section>
              <q-input
                v-model="filterText"
                rounded
                dense
                outlined
                clearable
                class="full-width"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item dense class="q-pa-none">
            <q-item-section>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="add" flat round class="font-navy" size="xs" dense to="/sessions/new"/>
            </q-item-section>
          </q-item>
          <q-separator class="q-mb-md" />
          <q-item v-for="rec in meetings" :key="rec.name" clickable @click="meetingDetails(rec.name)">
            <q-item-section>
              <q-item-label lines="1">
                {{ rec.name }}
              </q-item-label>
              <q-item-label caption>{{formatDate(rec.created)}}</q-item-label>
            </q-item-section>
            
            <q-separator />
          </q-item>
          
        </q-list>
      </q-scroll-area>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { DbService, AuthService } from '../services/firebase'
import { recordingService } from '../services/recordingsService'
import { date } from 'quasar'

export default defineComponent({
  name: 'CompositionComponent',
  setup(_, { root }) {
    const { getMeetings, meetings } = DbService()
    const { userid } = AuthService()
    const { setRecording } = recordingService()
    const filterText = ref('')

    onMounted(async() => {
      await userid()
      await getMeetings()
    })
    const filteredRecordings = () => {
      if (filterText.value === '') return meetings.value
      /* eslint-disable-next-line */
      return meetings.value.filter(rec => rec.name.toLowerCase().includes(filterText.value.toLowerCase()) || rec.summary.toLowerCase().includes(filterText.value.toLowerCase()))
    }
    const formatDate = (datestring: string) => {
      return date.formatDate(Date.parse(datestring), 'DD MMM YY h:mm:ss a')
    }
    const meetingDetails = (name: string) => {
      setRecording(name)
      /* eslint-disable-next-line */
      void root.$router.push('/sessions/' + name)
    }
    return {
      filterText,
      filteredRecordings,
      meetings,
      formatDate,
      meetingDetails
    }
  },
})
</script>
<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
