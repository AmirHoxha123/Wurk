<template>
  <div style="border: 1px solid #f4f8fd">
    <q-card flat  class="my-card" style="position: relative; background-color: #f4f8fd">
      <q-card-actions>
        <q-card-section @click="back" style="cursor: pointer;" class="q-mt-md">
          <q-icon name="fas fa-chevron-left" class="q-ml-xl"
                  size="20px" style="cursor: pointer "/>
        </q-card-section>

        <p style="font-size: 26px;height: 10px; top: auto;">
          {{ employeeFirstName }} {{ employeeLastName }}</p>
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
      <q-tab name="dashBoard"  label="Dashboard" no-caps @click="dashboard" /> |
      <q-tab name="workHistory"  label="Working History" no-caps @click="workHistory" /> |
      <q-tab name="payments" label="Payments" no-caps @click="payments" /> |
      <q-tab name="AccountInfo"  label="Account Info" no-caps @click="accountInfo"  />
      <q-btn icon="ion-create" label="Edit User" color="primary" no-caps @click="editUser"
             style="margin-left: auto; margin-right: 85px; border-radius: 10px; font-size: 16px" v-if="editBtn" />
    </q-tabs>
      <div v-if="showWorkingHistory">
        <workingHistory />
      </div>
      <div v-if="showPaymentsTab">
        <Payments />
      </div>
      <div class="q-ma-xl" >
        <q-table
            class="q-ml-xl"
            v-if="showDashboard"
            grid
            card-class="bg-primary text-white"
            title="Dashboard"
            :rows="rows"
            :columns="columns"
            row-key="name"
            :filter="filter"
            hide-header
        >

        </q-table>
      </div>
      <q-dialog v-model="showTheEditDialog" persistent>

        <q-card style="width: 700px; max-width: 80vw;">
          <div v-if="spinner">
            <q-inner-loading
                showing
                color="secondary"
            />
          </div>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Update Employee</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup  />
          </q-card-section>
          <br />
          <q-card-section class="q-pt-none">
            <q-form  @submit="saveUser(form.id)" ref="inputRef">
              <q-input outlined label="First Name"
                       v-model="form.firstName"
                       :rules="[val => !!val || 'First name is required']"
                       style="margin-bottom: 8px"
              />
              <q-input outlined label="Last Name"
                       v-model="form.lastName"
                       style="margin-bottom: 8px"
              />
              <br>
              <q-input type="number"
                       outlined label="Phone Number"
                       v-model="form.phoneNumber"
                       :rules="[val => !!val || 'Phone number is required']"
                       style="margin-bottom: 8px"
              />
              <q-input type="number"
                       outlined label="ID Number"
                       v-model.number="form.idNumber"
                       style="margin-bottom: 8px"
              />
              <br>
              <q-input type="password"
                       outlined label="New Password"
                       v-model="password.newPassword"
                       @keypress.space.prevent
              />
              <br>
              <q-card-section align="center" style="margin-bottom: 20px">
                <q-btn color="dark" no-caps label="Cancel" style="margin-left: 10px"
                       v-close-popup outline class="float-right" />

                <q-btn color="primary" type="submit" no-caps label="Save" class="float-right"  />
                <q-btn color="negative" no-caps @click="deleteUser(form.id)"
                       label="Delete Employee" class="float-left" />
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>

      </q-dialog>
    </div>
    <div>
      <q-inner-loading
          v-if="loading"
          showing
          color="secondary"
      />
    </div>
</template>

<script>
import axios from "axios";
import {ref} from 'vue'
import {date, useQuasar} from "quasar";
import workingHistory from "components/workingHistory";
import Payments from "components/Payments";
import dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration';
import * as toObject from 'dayjs/plugin/toObject';
dayjs.extend(toObject);
dayjs.extend(duration);

const columns = [
  { name: 'date', align: 'left', label: 'Date', field: 'date'},
  { name: 'projectLocation', align: 'left', label: 'Location Name', field: 'projectLocation'},
  { name: 'projectName', align: 'left', label: 'projectName', field: 'projectName'},
  { name: 'Start Time', align: 'left', label: 'Start Time', field: 'startTime' },
  { name: 'End Time', align: 'left', label: 'End Time', field: 'endTime' },
  { name: 'Duration', align: 'left', label: 'Duration', field: 'duration'},
  { name: 'Status', align: 'left', label: 'Status', field: 'status' },

]

const rows = []
const auth = localStorage.getItem('authorization');
const baseUrl = 'https://dev.api.wurk.skyver.co/api/employees/'
const headers = {
  "Accept": "application/json",
  'Content-Type': 'application.json',
  "Authorization": auth
}

export default {
  name: "overViewEmployee",
  components:{ Payments, workingHistory },
  setup(){
    const $q = useQuasar();
    return{
      tab: ref('dashBoard'),
      filter: ref(''),
      columns,
      triggerUpdateMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Employee was updated successfully.',
          position,
        })
      },
      triggerDeleteMessage (position){
        $q.notify({
          type: 'positive',
          message: 'Employee was removed successfully.',
          position,
        })
      }
    }
  },
  data(){
    return{
      newDuration: [],
      newStartTime: [],
      newEndTime: [],
      newDate: [],
      form:{
        firstName: '',
        lastName: "",
        phoneNumber: "",
        idNumber: null,
        id: '',
        accept : ref(false),
      },
      password:{
        newPassword: ''
      },
      editBtn: true,
      employeeFirstName: '',
      employeeLastName: '',
      spinner: false,
      loading: false,
      showWorkingHistory: false,
      showDashboard: true,
      showTheEditDialog: false,
      showNoDataMsg: false,
      showPaymentsTab: false,
      routerId: this.$route.params.id
    }
  },
  beforeMount() {
    this.getData();
  },
  methods: {
    getData(){
      this.loading = true
      axios.get(`${baseUrl}${this.routerId}`, { headers })
          .then((res) => {
            this.form = res.data
            this.employeeFirstName = res.data.firstName
            this.employeeLastName = res.data.lastName
          })
          .finally(() => this.loading = false)
    },
    back(){
      this.$emit('showEmployees')
      this.$router.push({path: '/employees'})
    },
    dashboard(){
      this.showPaymentsTab = false
      this.showWorkingHistory = false
      this.showDashboard = true
      this.showNoDataMsg = false
      this.editBtn = true
    },
    workHistory(){
      this.showPaymentsTab = false
      this.showWorkingHistory = true
      this.showDashboard = false
      this.editBtn = true
    },
    payments(){
      this.accountInfo()
      this.showPaymentsTab = true
      this.editBtn = false
    },
    accountInfo(){
      this.showPaymentsTab = false
      this.showWorkingHistory = false
      this.showDashboard = false
      this.showNoDataMsg = false
    },
    editUser(){
      this.password.newPassword = ''
      this.spinner = true
      this.showTheEditDialog = true;
      axios.get(`${baseUrl}${this.routerId}`, { headers })
          .then(res => {
            this.form = res.data;
          })
          .finally(()=> this.spinner = false)
    },
    saveUser(){
      if (this.form.accept !== true) {
        fetch(`${baseUrl}${this.routerId}`, {
          method: 'PUT',
          headers: new Headers({
            "Accept": "application/json",
            'Content-Type': 'application/json',
            "Authorization": auth
          }),
          body: JSON.stringify(this.form)
        })
            .then((res) => {
              this.getData();
              this.showTheEditDialog = false;
              if (res.status === 204) {
                this.triggerUpdateMessage('top-right')
              }
            })
        setTimeout(() => {
          fetch(`${baseUrl}${this.routerId}/password`, {
            method: 'PUT',
            headers: new Headers({
              "Accept": "application/json",
              'Content-Type': 'application/json',
              "Authorization": auth
            }),
            body: JSON.stringify(this.password)
          })
        }, 500)
      }
    },
    deleteUser(){
      if(this.form.accept !== true){
        fetch(`${baseUrl}${this.routerId}`, {
          method: 'DELETE',
          headers: new Headers({
            "Accept": "application/json",
            'Content-Type': 'application/json',
            "Authorization": auth
          }),
          body: JSON.stringify(this.form)
        })
            .then((res) => {
              this.showTheEditDialog = false;
              if(res.status === 204){
                this.triggerDeleteMessage('top-right')
                this.back()
              }
            })
      }
    }
  }
}
</script>

<style>
hr{
  margin: 0 60px 20px;
  max-width: 100%;
  height: 1px;
  background-color: lightgray;
  border: none;
}
.q-tab__label {
  font-size: 18px;
  font-weight: 700;

}
</style>
