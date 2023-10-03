<template>
  <div>
    <q-layout view="hHh Lpr lff">
      <q-drawer
        v-model="drawerLeft"
        show-if-above
        :width="300"
      >
        <div style="overflow-x: hidden">
          <EssentialLink />
        </div>
      </q-drawer>
      <q-page-container style="background: #f4f8fd ">
        <q-page>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>


<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from "components/EssentialLink";

export default defineComponent({
  name: 'MainLayout',
  setup(){
    return{
      drawer: ref(false),
      drawerLeft: ref(false),
      drawerRight: ref(false),
      options: [
        'Account', 'Sign out'
      ],
      showDropDown: false
    }
  },
  components: {
    EssentialLink

  }
})
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:ital,wght@0,400;1,600&display=swap');
.q-tab__label {
  font-size: 18px;
  font-weight: 700;
}
</style>
