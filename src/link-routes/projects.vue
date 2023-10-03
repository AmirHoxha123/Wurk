<template>
  <div class="q-pa-md" v-if="showProjects">
    <select name="lang" v-model="lang">
      <option value="en">English</option>
      <option value="ar">Arabic</option>
    </select>
    <p style="font-size: 35px;" class="q-ma-xl q-pl-xl q-pb-xl">{{ translate("welcome") }}</p>
    <div class="row justify-between">
      <q-input rounded outlined v-model="searchProject"
               type="search"
               class="q-ml-xl q-pl-xl col-2"
               style="margin-bottom: 10px; width: 450px;"
               dense color="white" bg-color="white"
               placeholder="Search Project"
               :class="{ 'input_thick_borders' : noBorders === true, 'myField' : noBorders }">
        >
        <template v-slot:prepend >
          <q-icon class="q-mr-xl" size="24px" name="search" color="primary" />
        </template>
      </q-input>
      <div class="q-mr-xl">
        <q-btn align="between" class="col-2 q-mr-xl" color="primary" label="Add Project" no-caps
               icon="ion-add-circle" @click="addLocationBtn" style="font-size: 16px; border-radius: 10px" />
      </div>
    </div>
    <q-list class="q-pt-md q-pl-xl q-ma-xl q-list">
      <q-item style="font-size: 16px; font-weight: 600"  align="left" class="q-ml-lg q-list">
        <q-item-section>Name</q-item-section>
        <q-item-section>Location</q-item-section>
        <q-item-section>Start Date</q-item-section>
        <q-item-section>End Date</q-item-section>
        <q-item-section>Action</q-item-section>
      </q-item>
      <q-list v-for="pr in filteredProjects" :key="pr"  @click="overviewProjects(pr.id)"
              style="margin-bottom: 12px; border-radius: 30px;" class="bg-white">
        <q-item style="padding: 30px 30px; font-size: 16px"  align="left" class="q-ml-lg q-list">
          <q-item-section>{{ pr.name }}</q-item-section>
          <q-item-section>{{ pr.location }}</q-item-section>
          <q-item-section>{{ pr.startDate }}</q-item-section>
          <q-item-section>{{ pr.endDate }}</q-item-section>
          <q-item-section>
            <q-icon name="fas fa-chevron-right" size="25px" class="q-ml-md" @click="overviewProjects(pr.id)"
                    style="cursor: pointer" title="Edit Project" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-list>
    <div v-if="filteredProjects.length < 1" class="q-pt-xl" style="margin: auto; width: 10%;">
      No Data
    </div>
    <q-dialog v-model="showDialouge" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Project</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <br />
        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit">
            <q-input outlined label="Name"
                     v-model="form.name"
                     :rules="[val => !!val || 'Name is required']"
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
                            subtitle="choose dates"
                            mask="DD-MM-YYYY"
                            :options="optionsFn"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" no-caps color="primary" flat  :ripple="true" />
                      </div>
                    </q-date>
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
                        subtitle="Choose the starting date"
                        mask="DD-MM-YYYY"
                        :options="options"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-card-actions align="right">
              <q-btn color="primary" type="submit" no-caps label="Add Project" />
              <q-btn color="dark" no-caps label="Cancel" v-close-popup outline />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div v-if="showLoading" class="fixed-center">
      <q-spinner
          color="primary"
          size="3em"
      />
    </div>
  </div>
    <router-view v-else />
</template>

<script>
import {ref} from "vue";
import {date, useQuasar} from 'quasar'
import en from 'src/en.js'
import ar from 'src/ar.js'
import getProjects from "src/common/getProjects";
import dayjs from 'dayjs'
import * as toObject from 'dayjs/plugin/toObject';
dayjs.extend(toObject);

const projectsUrl = 'https://dev.api.wurk.skyver.co/api/projects';
const tableColumns = []
const projectRows = []
let auth = localStorage.getItem('authorization')
export default {
  mixins: [en, ar],
  data () {
    return {
      lang: 'en',
      form:{
        name: "",
        startDate: "",
        endDate: "",
        id: "",
        accept : ref(false),
        options: [this.startDate]
      },
      startDateFormat: [],
      endDateFormat: [],
      formatAddStartDate: [],
      formatAddEndDate: [],
      spinner: false,
      showLabelText: true,
      showME: true,
      showEditDialog: false,
      showDialouge : ref(false),
      tableColumns,
      projectRows,
      submitted: false,
      showSave: true,
      loading: true,
      noBorders: true,
      searchProject: '',
      showProjects: true,
      showLoading: false,
    }
  },
  setup () {
    const modalActive = ref(true)
    const $q = useQuasar()
    return {
      modalActive,
      triggerAddMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Project  was added successfully.',
          position,
        })
      },
    }
  },
  watch: {
    '$route'(newVal){
      if(newVal.fullPath === '/projects')
        this.showProjects = true
    },
    showProjects(newValue) {
      if(newValue === true)
        this.getForm();
    }
  },
  computed:{
    filteredProjects(){
      return this.projectRows.filter((obj) => {
          return obj.name.toLowerCase().includes(this.searchProject.toLowerCase()) ||
              obj.location.toLowerCase().includes(this.searchProject.toLowerCase())
        })
    }
  },
  methods:{
     translate(prop){
      return (this[this.lang][prop])
    },
    clearForm(obj){
      for (const key in obj) {
        obj[key] = "";
      }
    },
    addLocationBtn() {
      this.clearForm(this.form);
      this.showDialouge = true
    },
    options(d){
      let date = this.form.startDate
      let newdate = date.split("-").reverse().join("/");
      return d > newdate
    },
    optionsFn (d) {
      return d >= date.formatDate(Date.now(), 'YYYY/MM/DD')
    },
    onSubmit () {
      if (this.form.accept !== true) {
        let date = this.form.startDate;
        let newdate = date.split("-").reverse().join("-");
        let endDate = this.form.endDate;
        let newendDate = endDate.split("-").reverse().join("-");
        this.showDialouge = false;
        fetch(projectsUrl, {
          method: 'POST',
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
            id: this.form.id,
          })
        })
            .then(res => {
              this.getForm();
              res.json();
              if(res.status === 201)
              this.triggerAddMessage('top-right');
              console.log(newdate);
            })
            .catch(err => console.error(err))
          this.submitted = true
          setTimeout(() => {
            this.submitted = false
          }, 3000)
        }
      },
    overviewProjects(id) {
      this.showProjects = false
      this.$router.replace({ name: 'projectsOverview', params: {id} })
    },
    getForm() {
      this.showLoading = true
      getProjects.getProjects()
        .then(res => {
          this.projectRows = res.data.map(obj => {
            this.startDateFormat = dayjs(obj.startDate).format('DD-MM-YYYY')
            this.endDateFormat = dayjs(obj.endDate).format('DD-MM-YYYY')
            return{
              name: obj.name,
              location: obj.location,
              startDate: this.startDateFormat,
              endDate: this.endDateFormat,
              id: obj.id
            }
          })
          if(res.status === 200)
            this.showLoading = false
        })
        .catch(error =>{
          if(error.response.status === 401 || error.response.status === 403){
              localStorage.removeItem('authorization')
              this.$router.push({ path: '/login' })
            console.log(error)
            }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  beforeMount() {
    this.getForm();
    this.$router.replace({path: '/projects'})
  },
}
</script>
<style>
* {
  font-family: 'Poppins', sans-serif;
}
@media screen and (max-width: 480px) {
  .q-list{
    padding: 0;
    margin: 0;
  }
}
</style>
<style lang="sass">
.myField.q-field--outlined
  .q-field__control:before
    border: 1px solid white
</style>
