<template>
  <div class="q-pa-md" v-if="showEmployees">
    <div v-if="loading" class="fixed-center">
      <q-spinner
          color="primary"
          size="3em"
      />
    </div>
    <p style="font-size: 35px;" class="q-ma-xl q-pl-xl q-pb-xl">Employees</p>
    <div class="row justify-between">
      <q-input rounded outlined v-model="searchEmployee"
               type="search" @keypress="getSearchData()"
               class="q-ml-xl q-pl-xl col-2"
               style="margin-bottom: 10px; width: 450px;"
               dense color="white" bg-color="white"
               placeholder="Search Employee"
               :class="{ 'input_thick_borders' : whiteBorder === true, 'myField' : whiteBorder }">

        >
        <template v-slot:prepend >
          <q-icon class="q-mr-xl" size="24px" name="search" color="primary" />
        </template>
      </q-input>
    <div class="q-mr-xl">
      <q-btn align="between" class="col-2 q-mr-xl" color="primary" label="Add Employee" no-caps
             icon="ion-add-circle" @click="addEmployeeBtn()" style="font-size: 16px; border-radius: 10px" />
    </div>
   </div>
    <q-list class="q-pt-md q-pl-xl q-ma-xl">
      <q-item style="font-size: 16px; font-weight: 600" align="left" class="q-ml-lg">
        <q-item-section>First Name</q-item-section>
        <q-item-section>Last Name</q-item-section>
        <q-item-section>Phone Number</q-item-section>
        <q-item-section>ID Number</q-item-section>
        <q-item-section>Working Status</q-item-section>
        <q-item-section>Action</q-item-section>
      </q-item>
      <q-list v-for="pr in rows" :key="pr" style="margin-bottom: 12px; border-radius: 30px;" class="bg-white"  @click="overviewEmployee(pr.id)">
        <q-item style="padding: 25px 25px; font-size: 16px" align="left" class="q-ml-lg">
          <q-item-section>{{ pr.firstName }}</q-item-section>
          <q-item-section>{{ pr.lastName }}</q-item-section>
          <q-item-section>{{ pr.phoneNumber }}</q-item-section>
          <q-item-section>{{ pr.idNumber }}</q-item-section>

          <q-item-section>
            <q-btn style="background-color: #44D219; border-radius: 10px; width: 75%; font-weight: 300"
                   text-color="white" no-caps padding="xs lg"
            >Working</q-btn>
          </q-item-section>
          <q-item-section>
            <q-icon name="fas fa-chevron-right" size="25px" class="q-ml-md" @click="overviewEmployee(pr.id)"
                                  style="cursor: pointer" title="Edit User" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-list>
    <div v-if="rows < 1" class="q-pt-xl" style="margin: auto; width: 10%;">
      No Data
    </div>
    <q-dialog v-model="showDialouge" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Employee</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <br />

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit">
            <q-input outlined label="First Name"
                     v-model="form.firstName"
                     :rules="[val => !!val || 'First Name is required']"
                     style="margin-bottom: 8px"
            />
            <q-input outlined label="Last Name"
                     v-model="form.lastName"
                     style="margin-bottom: 8px"
            />
            <br>
            <q-input outlined label="Phone Number" type="tel"
                     v-model="form.phoneNumber"
                     :rules="[val => !!val || 'Phone Number is required']"
                     style="margin-bottom: 8px"
            />
            <q-input outlined label="ID Number" type="number"
                       v-model="form.idNumber"
                       style="margin-bottom: 8px"
            />
            <br>
            <q-input outlined label="Password" type="password"
                     v-model="form.password" @keypress.space.prevent
                     style="margin-bottom: 8px"
            />
            <q-card-actions align="right">
              <q-btn color="primary" type="submit" no-caps label="Add location" />
              <q-btn color="dark" no-caps label="Cancel" v-close-popup outline />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    </div>
  <OverViewEmployee v-else />
  <router-view @showEmployees="changeEmployees()" />
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import axios from "axios";
import overViewEmployee from "src/link-routes/overViewEmployee";
import fetchEmployees from 'src/common/fetch-employees'
const columns = [
  {  name: 'First Name', align: 'left', label: 'First Name', field: 'firstName'},
  {  name: 'Last Name', align: 'left', label: 'Last Name', field: 'lastName'},
  {  name: 'Phone Number', align: 'left', label: 'Phone Number', field: 'phoneNumber'},
  {  name: 'ID Number', align: 'left', label: 'ID Number', field: 'idNumber'},
  {  name:'Status', align: 'left', label: 'Working Status', field: 'Status'},
  {  name:'Action', align: 'left', label: 'Action', field: 'Action'}
]

const rows = [];
let auth = localStorage.getItem('authorization')
export default {
  data(){
    return{
      form:{
        firstName: "",
        lastName: "",
        phoneNumber: "",
        idNumber: null,
        password: "",
        id: '',
      },
      loading: true,
      showDialouge: false,
      searchEmployee: null,
      showEmployees: true,
      whiteBorder: true,
    }
  },
  setup () {
    const $q = useQuasar();
    return {
      columns,
      rows: ref(rows),
      triggerAddMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Employee was added successfully.',
          position,
        })
      },
    }
  },
  components: { overViewEmployee },
  mounted() {
    this.getData();
    this.$router.push({path: '/employees'})
  },
  watch: {
    '$route'(newVal){
      if(newVal.fullPath === '/employees')
        this.showEmployees = true
    },
    showEmployees(newValue) {
      if(newValue === true)
        this.getData();
    }
  },
  methods: {
    changeEmployees(){
      this.showEmployees = true
    },
    async getSearchData(){
      await axios.get(`https://dev.api.wurk.skyver.co/api/employees/search?keyword=${this.searchEmployee}`, {
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application.json',
          "Authorization": auth
        },
      })
          .then((res) => {
            this.rows = res.data
          })
          .then((err) => {
            console.log(err)
          })

    },
    overviewEmployee(id) {
      this.showEmployees = false
      this.$router.replace({ name: 'employeeOverview', params: {id} })

    },
    clearForm(){
      this.form.firstName = '';
      this.form.lastName = '';
      this.form.phoneNumber = '';
      this.form.idNumber = '';
    },
    addEmployeeBtn() {
      this.clearForm();
      this.form.password = '';
      this.showDialouge = true
    },

    getData() {
      fetchEmployees.getEmployees()
          .then(res => {
            this.rows = res.data;
            if(res.status === 200)
              this.loading = false

          })
          .catch(error => {
            if(error.response.status === 401 || error.response.status === 403){
              localStorage.removeItem('authorization')
              this.$router.push({ path: '/login' })
              console.log(error)
            }
          })
    },
    onSubmit () {
        this.showDialouge = false;
        axios.post('https://dev.api.wurk.skyver.co/api/employees',this.form,{
          headers:{
            "Accept": "application/json",
            'Content-Type': 'application/json',
            "Authorization": auth
          },
        })

            .then(() => {
              this.getData();
              this.triggerAddMessage('top-right');
            })
            .catch(err => console.error(err))


    },
  },
}
</script>
<style lang="sass">
.myField.q-field--outlined
  .q-field__control:before
    border: 1px solid white
</style>