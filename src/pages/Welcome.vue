<template>
  <q-page class="row items-center justify-evenly">
    <!-- content -->
    <div id="login-container"></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { firebaseUIConfig, ui } from '../services/firebase'
import 'firebaseui/dist/firebaseui.css'

export default defineComponent({
  name: 'WelcomePage',
  setup () {
    onMounted (() => {
      ui.start('#login-container', firebaseUIConfig)
    })
    return {}
  }
})
</script>
