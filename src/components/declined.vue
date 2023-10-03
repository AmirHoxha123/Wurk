<template>
  <div>
    <div v-if="loading">
      <q-inner-loading
          showing
          color="secondary"
      />
    </div>
    <q-list class="q-pt-md q-pl-lg q-ma-xl">
      <q-item class="q-ml-xl">
        <q-item-section><strong>Employee</strong> </q-item-section>
        <q-item-section><strong>Project</strong> </q-item-section>
        <q-item-section><strong>Start Time</strong></q-item-section>
        <q-item-section><strong>End Time</strong></q-item-section>
        <q-item-section><strong>Duration</strong></q-item-section>
        <q-item-section><strong>Action</strong></q-item-section>
        <q-item-section><strong>Edit</strong></q-item-section>
      </q-item>
      <q-list style="margin-bottom: 20px; border-radius: 30px;" v-for="row in declinedRows" :key="row" class="bg-white q-ml-lg">
        <q-item style="padding: 25px 25px" class="q-ml-lg">
          <q-item-section >
            {{ row.firstName }}
            <div style="font-size: 12px; color: #696969;">
              {{ row.lastName }}
            </div>
          </q-item-section>
          <q-item-section >
            {{ row.projectName }}
            <br />
            <div style="font-size: 12px; color: #696969;">
              {{ row.projectLocation }}
            </div>
          </q-item-section>
          <q-item-section >
            {{ row.startTime }}
            <br />
            <div style="font-size: 12px; color: #696969;">
              {{ row.date }}
            </div>
          </q-item-section>
          <q-item-section >
            {{ row.endTime }}
            <br />
            <div style="font-size: 12px; color: #696969;">
              {{ row.date }}
            </div>
          </q-item-section>
          <q-item-section>
            {{ row.duration }}
          </q-item-section>
          <q-item-section style="margin-right: 10px">
            <div class="row" >
              <q-btn v-if="checkApproved(row.id)"
                     label="Pending" color="primary" class="col" flat
                     :loading="pendingLoading && pendingIndexClicked === row.id" :ripple="false"
                     no-caps style="margin-right: 10px; cursor: context-menu;" />
              <q-btn v-else color="primary" no-caps style="margin-right: 10px; cursor: pointer;"
                     class="col" padding="xs xl"
                     @click="pendingBtn(row.id)"
                     label="Pending"
              />
              <q-btn v-if="declineApproved(row.id)" flat :ripple="false"
                     label="Approved" no-caps class="col" color="primary"
                     style="cursor: context-menu; margin-right: 10px;"
                     :loading="declineLoading && declinedIndexClicked === row.id"
              />
              <q-btn v-else class="col" style="cursor: pointer; color: #1976d2; margin-right: 10px;" outline
                     no-caps label="Approve" @click="approveBtn(row.id)" padding="xs xl"
              />

            </div>
          </q-item-section>
          <q-item-section>
            <q-icon name="far fa-edit" size="20px" style="cursor: pointer" @click="editApprovals(row.id)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-list>
    <div v-if="declinedRows.length < 1" class="q-pt-xl" style="margin: auto; width: 10%;">
      No Data
    </div>
    <q-dialog v-model="showTheEditDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <div v-if="declinedLoading">
          <q-inner-loading
              showing
              color="secondary"
          />
        </div>
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Working Timeframe</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="xBtn()" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form>
            <q-input v-model="FirstName" outlined
                     style="margin-bottom: 8px"
                     label="Employee" readonly
            />
            <br>
            <q-select v-model="this.model" outlined
                      :rules="[val => !!val || 'Project name is required']"
                      style="margin-bottom: 8px"
                      :options="options"
                      option-value="id"
                      option-label="name" label="Project"
                      emit-value
                      map-options
            />
            <q-input v-model="form.startTime" outlined
                     :rules="[val => !!val || 'Start Time is required',
                                 val => val.length === 5 || 'Incorrect Time',
                                 val => val[0] + val[1] < '24' || 'Incorrect Time',
                                 val => val[3] < '6' || 'Incorrect Time',
                              ]"
                     style="margin-bottom: 8px"
                     label="Start Time"
                     mask="##:##"
            />
            <q-input v-model="form.endTime" outlined
                     :rules="[val => !!val || 'End Time is required',
                                 val => val.length === 5 || 'Incorrect Time',
                                 val => val[0] + val[1] < '24' || 'Incorrect Time',
                                 val => val[3] < '6' || 'Incorrect Time',
                              ]"
                     style="margin-bottom: 8px"
                     label="End Time"
                     mask="##:##"
            />
            <q-card-actions align="center">
              <span style="color: red; font-size: 16px">{{ errorMsg }}</span>
            </q-card-actions>
            <q-card-actions align="right">
              <q-btn label="Save" no-caps color="primary" @click="saveApprovals(form.id)" />
              <q-btn color="dark" no-caps label="Cancel" v-close-popup outline @click="xBtn" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>

    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import * as duration from 'dayjs/plugin/duration';
import {ref} from "vue";
dayjs.extend(duration)
let formattedStartTime = ''
let formattedEndTime = ''
const auth = localStorage.getItem('authorization');
const baseUrl = 'https://dev.api.wurk.skyver.co/api/workingtimeframes/status'
const headers = {
  "Accept": "application/json",
  'Content-Type': 'application.json',
  "Authorization": auth
}
export default {
  name: "approved",
  setup () {
    return {
      model: ref(null),
    }
  },
  data(){
    return{
      declinedRows: [],
      newDuration: '',
      newStartTime: '',
      newEndTime: '',
      loading: false,
      pendingTimeframe: [],
      declinedTimeframe: [],
      pendingLoading: false,
      declineLoading: false,
      pendingIndexClicked: '',
      declinedIndexClicked: '',
      showTheEditDialog: false,
      form: {
        rawStartTime:'',
        rawEndTime:'',
        projectName: '',
        startTime: "",
        endTime: "",
        id: ''
      },
      newFormStartTime: '',
      newFormEndTime: '',
      errorMsg: '',
      FirstName: '',
      options: [],
      declinedLoading: false
    }
  },
  mounted() {
    this.getApproved()
    this.getForm()
  },
  methods:{
    checkApproved(id){
      return  this.pendingTimeframe.includes(id)
    },
    declineApproved(id){
      return  this.declinedTimeframe.includes(id)
    },
    getApproved(){
      this.loading = true
      axios.get(`${baseUrl}?status=DECLINED`,  { headers })
          .then((res) => {
            this.declinedRows = res.data.map(obj => {
              const times = dayjs.duration(obj.duration)
              this.newDuration = `${times.hours()}h:${times.minutes()}m`
              obj.duration = this.newDuration;
              const startTime24Format = dayjs(obj.startTime);
              const endTime24Format = dayjs(obj.endTime);
              this.newStartTime = `${dayjs(obj.startTime).format('HH:mm')}`;
              if(endTime24Format.hour() === null || endTime24Format.toObject().minutes)
                this.newEndTime = `${dayjs(obj.endTime).format('HH:mm')}`;
              else
                this.newEndTime = ''
              this.newDate = `${startTime24Format.format('DD-MM-YYYY')}`
              return {
                firstName: obj.firstName,
                lastName: obj.lastName,
                date: this.newDate,
                projectLocation: obj.projectLocation,
                projectName: obj.projectName,
                startTime: this.newStartTime,
                endTime: this.newEndTime,
                duration: this.newDuration,
                status: obj.status,
                id: obj.id
              }
            })
            if(res.status === 200){
              this.loading = false
            }
          })
          .catch((err) => {
            if(err.response.status === 401 || err.response.status === 403){
              localStorage.removeItem('authorization')
              this.$router.push({ path: '/login' })
              console.log(err)
            }
          })
    },
    editApprovals(id) {
      this.showTheEditDialog = true
      this.form.startTime = this.newStartTime
      this.form.endTime = this.newEndTime
      this.declinedLoading = true
      axios.get(`https://dev.api.wurk.skyver.co/api/workingtimeframes/${id}`, { headers })
          .then(res => {
            formattedStartTime = dayjs(res.data.startTime).format('HH:mm')
            formattedEndTime = dayjs(res.data.endTime).format('HH:mm')
            this.FirstName = res.data.firstName
            this.model = res.data.projectId
            this.form.rawEndTime = res.data.endTime
            this.form.rawStartTime = res.data.startTime
            this.form.projectName = res.data.projectName
            this.form.startTime = formattedStartTime
            this.form.endTime = formattedEndTime
            this.form.id = res.data.id
            if(res.status === 200)
              this.declinedLoading = false
          })
      this.FirstName = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.model = null
    },
    saveApprovals(id){
      this.newFormStartTime = this.form.rawStartTime.substring(0, 11) +
          this.form.startTime + this.form.rawStartTime.substring(16)
      this.newFormEndTime = this.form.rawEndTime.substring(0, 11) +
          this.form.endTime + this.form.rawEndTime.substring(16)
      // At index 11 till index 16 change whats inside that to this.form.endTime
      fetch(`https://dev.api.wurk.skyver.co/api/workingtimeframes/${id}`, {
        method: 'PUT',
        headers: new Headers({
          "Accept": "application/json",
          'Content-Type': 'application/json',
          "Authorization": auth
        }),
        body: JSON.stringify({
          projectId: this.model,
          startTime: this.newFormStartTime,
          endTime: this.newFormEndTime,
        })
      })
          .then(res => {
            if (res.status === 204) {
              this.showTheEditDialog = false
              this.errorMsg = ''
              this.getApproved()
            }
            if(res.status === 400)
              this.errorMsg = 'Wrong Format'
          })
          .catch(err => console.warn(err))
    },
    xBtn(){
      this.errorMsg = ''
    },
    pendingBtn(id){
      this.pendingLoading = true
      this.pendingTimeframe.push(id);
      this.pendingIndexClicked = id
      let removeIndex = this.declinedTimeframe.indexOf(id)
      if(removeIndex > -1){
        this.declinedTimeframe.splice(removeIndex, 1)
      }
      axios.put(`https://dev.api.wurk.skyver.co/api/workingtimeframes/${id}/status?status=PENDING`,
          {}, {headers})
          .then(res => {
            if (res.status === 204)
              this.pendingLoading = false
          })
          .catch(err => console.warn(err))
    },
    approveBtn(id){
      this.declineLoading = true
      this.declinedTimeframe.push(id);
      this.declinedIndexClicked = id;
      let removeIndex = this.pendingTimeframe.indexOf(id)
      if(removeIndex > -1){
        this.pendingTimeframe.splice(removeIndex, 1)
      }
      axios.put(`https://dev.api.wurk.skyver.co/api/workingtimeframes/${id}/status?status=APPROVED`,
          {}, {headers})
          .then(res => {
            if (res.status === 204) {
              this.declineLoading = false
            }
          })
          .catch(err => console.warn(err))
    },
    getForm() {
      axios.get('https://dev.api.wurk.skyver.co/api/projects', {
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application.json',
          "Authorization": auth
        }
      })
          .then(res => {
            this.options = res.data.map(obj => {
              return{
                id: obj.id,
                name: obj.name
              }
            })
          })
    },
  }
}
</script>

<style scoped>

</style>