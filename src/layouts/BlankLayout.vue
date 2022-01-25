<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'BlankLayout',
  setup () {
    return {
    }
  }
})
</script>
