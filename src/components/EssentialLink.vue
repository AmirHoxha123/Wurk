<template>
  <div>
    <div class="q-pt-lg q-pl-xl q-pb-md">
      <img  :src="wurkTextLogo" alt="Wurk logo" @click="this.$router.push({path: '/projects'})"/>
    </div>
    <hr style="width: 85%; margin: auto; background-color: #21a3fb">
    <q-list class="AllRoutes">
      <q-item v-for="link in links" :key="link.id" clickable v-ripple  class="menu-items">
        <router-link :to="link.routeTo" active-class="active" exact class="side-btn">
          <q-icon :name="link.icon" class="icon" size="md"/>
          <a>{{ link.title }}</a>
        </router-link>
      </q-item>
    </q-list>
    <div class="bottom-line"/>
    <div class="q-ml-md absolute-bottom q-gutter-sm">
      <q-btn rounded align="between" style="font-size: 18px;"
             class="btn-fixed-width q-ma-xl" padding="xs lg"
             color="white" text-color="primary" label="Amir" no-caps icon="ion-contact" >
        <q-menu>
                        <q-list style="min-width: 130px">
                          <q-item clickable style="margin-left: -20px">
                            <q-avatar icon="ion-person" >
                            </q-avatar>
                            <q-item-section>Account</q-item-section>
                          </q-item>
                          <q-item clickable style="margin-left: -20px" @click="logOut">
                            <q-avatar icon="ion-log-out"></q-avatar>
                            <q-item-section >Log out</q-item-section>
                          </q-item>
                          <q-separator />
                        </q-list>
                      </q-menu>
      </q-btn>
      <p class="q-ml-xl q-mt-lg" style="color: #DADADA; font-size: 16px; margin-bottom: 0">
        <span style="font-size: 22px"> &#169;</span> skyver | 2022</p>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue'
import wurkTextLogo from 'src/assets/WurkTextLogo.png'


export default defineComponent({
  name: 'EssentialLink',
  data() {
    return{
      links: [
        {name: 'project', title: 'Projects', id: 1, icon: 'fas fa-solid fa-map', routeTo: '/projects'},
        {name: 'employees', title: 'Employees', id: 2, icon: 'ion-contacts', routeTo: '/employees'},
        {name: 'approvals', title: 'Approvals', id: 3, icon: 'fas fa-check', routeTo: '/approvals' },
        ],
      active: true,
      wurkTextLogo: wurkTextLogo,
      tab: ref('project'),
    }
  },
  methods: {
    logOut(){
      console.log('this is the logout');
      this.$router.push({path: '/login'});
      localStorage.removeItem('authorization');
    }
  }
})
</script>
<style>
hr{
  height: 1px;
  background-color: #1976d2;
  border: none;
}
.AllRoutes{
  font-size: 18px;
  margin-top: 30px;
}
.AllRoutes a{
  text-decoration: none;
  color: black;
}
.icon{
  padding: 0 40px 0 25px;
  color: #1976d2;
}
.menu-items {
  display: flex;
  flex-direction: column;
  padding: 0;
}
.side-btn {
  padding: 25px 0;
  cursor: pointer;
  font-size: 18px;
}
.side-btn a{
  color: #DADADA;
  font-size: 16px;
}
.side-btn .icon{
  color: #DADADA;
}
.side-btn.active {
  box-shadow: -3px 0 0 0  #1976d2 inset, 3px 0 0 0 #1976d2 inset;
}
.side-btn.active a{
  color: #1976d2;
}
.side-btn.active .icon{
  color: #1976d2;
}
</style>
<style lang="sass">
.btn-fixed-width
  width: 150px
</style>
