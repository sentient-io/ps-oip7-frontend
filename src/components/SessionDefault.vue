<template>
  <div class="fit row flex-center text-center q-pa-xl">
    <h6 class="text-overline">
      Nothing to Display. Select a meeting recording. Or<br />
      <q-btn dense flat no-caps class="text-bold font-navy underline" label="create" to="sessions/new" /> a meeting recording.
   </h6>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
//import { recordingService } from '../services/recordingsService'

export default defineComponent({
  name: 'MeetingComponent',
  setup() {
    return {
    }
  }
})
</script>
<style lang="scss">
.underline {
  border-bottom: 2px solid $s-navy;
  border-radius: 0px;
}
</style>