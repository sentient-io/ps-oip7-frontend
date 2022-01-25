<template>
  <q-layout view="lHh lpR fFf">

    <q-drawer 
      show-if-above
      v-model="drawer"
      side="left"
      behavior="desktop"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      dark
      :width="200"
      :breakpoint="500"
      content-class="bg-navy"
    >
      <q-list padding class="full-height">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="graphic_eq" />
          </q-item-section>

          <q-item-section>
            Recordings
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>
            Settings
          </q-item-section>
        </q-item>

        <q-separator dark />

        <q-item clickable v-ripple @click="logOut">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            Sign Out
          </q-item-section>
        </q-item>
      </q-list>
      <q-space />
      <q-list>
      </q-list>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { AuthService } from '../services/firebase'

export default defineComponent({

  name: 'MainLayout',
  setup(_, ctx) {
    const  { signOut } = AuthService()
    
    const logOut = async () => {
      await signOut()
      await ctx.root.$router.push('/')
    }
    return {
      drawer: false,
      miniState: true,
      logOut
    }
  }
});
</script>
