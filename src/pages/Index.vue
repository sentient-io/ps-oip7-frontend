<template>
  <q-page class="row bg-navy fit items-stretch">
    <div class="full-width row">
      <div class="col-3 q-pa-md s-rounded-borders-left bg-base">
        <recordings-list />
      </div>
      <div class="col bg-base">
        <div class="row fit q-pa-md s-rounded-borders-left bg-white">
          <router-view>
            Default View
          </router-view>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import RecordingsList from '../components/RecordingsList.vue';
import { defineComponent, } from '@vue/composition-api';

export default defineComponent({
  name: 'MainPage',
  components: { RecordingsList },
  setup() {
    return {}
  }
})
</script>
