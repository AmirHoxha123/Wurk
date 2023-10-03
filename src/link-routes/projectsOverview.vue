<template>
<div style="border: 1px solid #f4f8fd">
  <div v-if="showLoading" class="fixed-center">
    <q-spinner
        color="primary"
        size="3em"
    />
  </div>
  <q-card flat  class="my-card" style="position: relative; background-color: #f4f8fd">
    <q-card-actions>
      <q-card-section @click="backToProjects" style="cursor: pointer;" class="q-mt-md">
        <q-icon name="fas fa-chevron-left" class="q-ml-xl"
                size="20px" style="cursor: pointer "/>
      </q-card-section>

      <p style="font-size: 26px;height: 10px; top: auto;">
        {{ name }} {{ location }}</p>
    </q-card-actions>

  </q-card>

  <hr />
  <q-tabs
      v-model="tab"
      style="margin-left: 95px; color: #CBCBCB;"
      dense align="left"
      indicator-color="transparent"
      active-color="primary"
  >
    <q-tab name="dashboard"  label="Dashboard" no-caps @click="dashboard" /> |
    <q-tab name="expenses"  label="Expenses" no-caps @click="expenses" />
    <q-btn v-if="showEditBtn" icon="ion-create" label="Edit Project" color="primary" no-caps @click="editUser"
           style="margin-left: auto; margin-right: 85px" />
  </q-tabs>
  <div v-if="projectDashboard">
    <projectDashboard/>
  </div>
  <div v-if="projectExpenses">
    <projectExpenses/>
  </div>
  <q-dialog v-model="showEditDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <div v-if="spinner">
        <q-inner-loading
            showing
            color="secondary"
        />
      </div>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Update Project</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup  />
      </q-card-section>
      <br />
      <q-card-section class="q-pt-none">
        <q-form @submit="saveUser(form.id)">
          <q-input outlined label="Name"
                   v-model="form.name"
                   :rules="[val => !!val || 'name is required']"
                   style="margin-bottom: 8px"
          />
          <q-input outlined label="Location"
                   v-model="form.location"
                   :rules="[val => !!val || 'Working Location is required']"
                   style="margin-bottom: 8px"
          />
          <q-input v-model="form.startDate"
                   outlined label="Start date"
                   :rules="[val => !!val || 'Starting date is required']"
                   style="margin-bottom: 8px"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="form.startDate"
                          subtitle="choose starting date"
                          mask="DD-MM-YYYY"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input v-model="form.endDate"
                   outlined label="End date"
                   :rules="[val => !!val || 'Ending date is required']"
                   style="margin-bottom: 8px"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date
                      v-model="form.endDate"
                      subtitle="choose ending date"
                      mask="DD-MM-YYYY"
                      :options="options"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-card-section align="center">
            <q-btn color="dark" no-caps label="Cancel" style="margin-left: 10px"
                   v-close-popup outline class="float-right" />

            <q-btn color="primary" type="submit" no-caps label="Save" class="float-right"  />
            <q-btn color="negative" no-caps @click="deleteUser(form.id)"
                   label="Delete Project" class="float-left" />
          </q-card-section>
          <br />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import {useQuasar} from "quasar";

let auth = localStorage.getItem('authorization')
const projectsUrl = 'https://dev.api.wurk.skyver.co/api/projects';

import getProjects from "src/common/getProjects";
import projectDashboard from "components/projectDashboard";
import projectExpenses from "components/projectExpenses";
import dayjs from "dayjs";
import {ref} from "vue";

export default {
  setup(){
    const $q = useQuasar()
    return{
      triggerUpdateMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Project was updated successfully.',
          position,
        })
      },
      triggerDeleteMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Project was deleted successfully.',
          position,
        })
      },
    }
  },
  name: "projectsOverview",
  components: { projectDashboard, projectExpenses },
  data(){
    return{
      tab: 'dashboard',
      id: this.$route.params.id,
      name: '',
      location: '',
      showLoading: false,
      spinner: false,
      showEditDialog: false,
      projectDashboard: true,
      projectExpenses: false,
      showEditBtn: true,
      form:{
        name: "",
        startDate: "",
        endDate: "",
        id: "",
        accept : ref(false),
        options: [this.startDate]
      },
    }
  },
  mounted() {
    this.getProjectsById()
  },
  methods:{
    getProjectsById(){
      this.showLoading = true
      getProjects.getProjectsByID(this.id)
      .then(res => {
        this.name = res.data.name
        this.location = res.data.location
        if(res.status === 200)
          this.showLoading = false
      })
    },
    editUser(){
      this.spinner = true;
      this.clearForm();
      this.showEditDialog = true
      getProjects.getProjectsByID(this.id)
          .then(res => {
            this.form.name = res.data.name
            this.form.location = res.data.location
            this.form.startDate = dayjs(res.data.startDate).format('DD-MM-YYYY');
            this.form.endDate = dayjs(res.data.endDate).format('DD-MM-YYYY');
            this.form.id = res.data.id
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.spinner = false;
          })
    },
    saveUser() {
      let date = this.form.startDate;
      let newdate = date.split("-").reverse().join("-");
      let endDate = this.form.endDate;
      let newendDate = endDate.split("-").reverse().join("-");
      if(this.form.accept !== true){
        fetch(`${projectsUrl}/${this.id}`, {
          method: 'PUT',
          headers: new Headers({
            "Accept": "application/json",
            'Content-Type': 'application/json',
            "Authorization": auth
          }),
          body: JSON.stringify({
            name: this.form.name,
            location: this.form.location,
            startDate: newdate,
            endDate: newendDate,
            id: this.form.id
          })
        })
            .then((res) => {
              this.getProjectsById();
              this.showEditDialog = false;
              if(res.status === 204)
                this.triggerUpdateMessage('top-right')
            })
      }
    },
    deleteUser(id){
      let date = this.form.startDate;
      let newdate = date.split("-").reverse().join("-");
      let endDate = this.form.endDate;
      let newendDate = endDate.split("-").reverse().join("-");
      fetch(`${projectsUrl}/${id}/`, {
        method: 'DELETE',
        headers: new Headers({
          "Accept": "application/json",
          'Content-Type': 'application/json',
          "Authorization": auth
        }),
        body: JSON.stringify({
          name: this.form.name,
          location: this.form.location,
          startDate: newdate,
          endDate: newendDate,
        })
      })
          .then((res) => {
            this.getProjectsById();
            this.showEditDialog = false;

            if(res.status === 204){
              this.backToProjects()
              this.triggerDeleteMessage('top-right')

            }
          })
    },
    backToProjects(){
      this.$router.push({path: '/projects'})
    },
    clearForm(){
      this.form.name = '';
      this.form.location = '';
      this.form.startDate = '';
      this.form.endDate = '';
    },
    dashboard(){
      this.projectDashboard = true
      this.projectExpenses = false
      this.showEditBtn = true

    },
    expenses(){
      this.projectDashboard = false
      this.projectExpenses = true
      this.showEditBtn = false
    },
  },
}
</script>

<style scoped>
hr{
  margin: 0 60px 20px;
  max-width: 100%;
  height: 1px;
  border: none;
}
</style>