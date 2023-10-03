<template>
  <div class="q-pa-md">
    <div v-if="spinner">
      <q-inner-loading
          showing
          color="secondary"
      />
    </div>
    <p style="font-size: 35px;" class="q-ma-xl q-pl-xl q-pb-lg">{{ status }} Approvals</p>
    <div class="q-gutter-y-md">
      <q-tabs
          class="q-mb-xl"
          v-model="tab"
          style="margin-left: 80px ; color: #CBCBCB;"
          align="left"
          indicator-color="transparent"
          active-color="primary"
      >
        <q-tab name="pending"  label="PENDING" no-caps @click="pending"/> |
        <q-tab name="Approved"  label="APPROVED" no-caps @click="approved"/> |
        <q-tab name="Declined"  label="DECLINED" no-caps @click="declined"/>
    </q-tabs>
    </div>
    <div v-if="approvalsTab">
      <q-list class="q-pt-md q-pl-xl q-ma-xl" >
        <q-item class="q-ml-lg">
          <q-item-section><strong>Employee</strong> </q-item-section>
          <q-item-section><strong>Project</strong> </q-item-section>
          <q-item-section><strong>Start Time</strong></q-item-section>
          <q-item-section><strong>End Time</strong></q-item-section>
          <q-item-section><strong>Duration</strong></q-item-section>
          <q-item-section><strong>Action</strong></q-item-section>
          <q-item-section><strong>Edit</strong></q-item-section>
        </q-item>
        <q-list style="margin-bottom: 12px; border-radius: 30px;" v-for="row in pendingRows" :key="row" class="bg-white">
          <q-item style="padding: 25px 25px" class="q-ml-lg">
            <q-item-section >
              {{ row.firstName }}<div style="font-size: 12px; color: #696969;">
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
                <q-btn v-if="checkApproved(row.id)" flat
                       label="Approved" color="primary" class="col" :ripple="false"
                       :loading="approveLoading && approvedIndexClicked === row.id"
                       no-caps style="margin-right: 10px; cursor: context-menu;" />
                <q-btn v-else color="primary" no-caps style="margin-right: 10px; cursor: pointer;"
                       class="col"
                       @click="approveBtn(row.id)"
                       label="Approve"
                />
                <q-btn v-if="declineApproved(row.id)" flat :ripple="false"
                       label="Declined" no-caps class="col" style="
                                 cursor: context-menu; color: red; margin-right: 10px;"
                       :loading="declineLoading && declinedIndexClicked === row.id"
                />
                <q-btn v-else class="col bg-red-6" style="cursor: pointer; color: white; margin-right: 10px;"
                       no-caps label="Decline" @click="declineBtn(row.id)"
                />

              </div>
            </q-item-section>
            <q-item-section>
              <q-icon name="far fa-edit" size="20px" style="cursor: pointer" @click="editApprovals(row.id)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-list>
      <div v-if="pendingRows.length < 1" class="q-pt-xl" style="margin: auto; width: 10%;">
        No Data
      </div>
    </div>
      <q-dialog v-model="showTheEditDialog" persistent>
        <q-card style="width: 700px; max-width: 80vw;">
          <div v-if="pendingLoading">
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
              ></q-input>
              <br/>
              <q-select v-model="model" outlined
                        :rules="[val => !!val || 'Project name is required']"
                        style="margin-bottom: 8px" label="Project"
                        :options="options"
                        option-value="id"
                        option-label="name"
                        emit-value
                        map-options
              >
              </q-select>
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
                       :rules="[val => !!val || 'Start Time is required',
                                 val => val.length === 5 || 'Incorrect Time',
                                 val => val[0] + val[1] < '24' || 'Incorrect Time',
                                 val => val[3] < '6' || 'Incorrect Time',
                              ]"
                       style="margin-bottom: 8px"
                       label="End Time"
                       mask="##:##"
              />
              <q-card-actions align="right">
                <q-btn label="Save" color="primary" @click="saveApprovals(form.id)" no-caps />
                <q-btn color="dark" no-caps label="Cancel" v-close-popup outline @click="xBtn" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>

      </q-dialog>
      <div v-if="approvedTab"><Approved /></div>
      <div v-if="declinedTab"><declined /></div>
    </div>
</template>

<script>
import {ref} from "vue";
import axios from "axios";
import dayjs from "dayjs";
import * as duration from 'dayjs/plugin/duration';
import * as toObject from 'dayjs/plugin/toObject';
import Approved from "components/approved";
import declined from "components/declined";
dayjs.extend(toObject);
dayjs.extend(duration)

const auth = localStorage.getItem('authorization');
const baseUrl = 'https://dev.api.wurk.skyver.co/api/workingtimeframes/status'
const headers = {
  "Accept": "application/json",
  'Content-Type': 'application.json',
  "Authorization": auth
}
let formattedStartTime = ''
let formattedEndTime = ''
export default {
  name: "approval-table",
  components: { Approved, declined },
  setup () {
    return {
      model: ref(null),
    }
  },
  data(){
    return{
      tab: ref('pending'),
      approvalsTab: true,
      approvedTab: false,
      declinedTab: false,
      pendingRows: [],
      newDuration: '',
      newStartTime: '',
      newEndTime: '',
      newDate: '',
      approvalStatus: '',
      approveLoading: false,
      declineLoading: false,
      approvedTimeframe: [],
      declinedTimeframe: [],
      approvedIndexClicked: undefined,
      declinedIndexClicked: undefined,
      spinner: false,
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
      options: [],
      FirstName: '',
      pendingLoading: false,
      status: 'Pending',
    }
  },
  mounted() {
    this.getPending()
    this.getForm()
  },
  methods: {
    checkApproved(id){
      return  this.approvedTimeframe.includes(id)
    },
    declineApproved(id){
      return  this.declinedTimeframe.includes(id)
    },
    getPending(){
      this.spinner = true
      axios.get(`${baseUrl}?status=PENDING`,  { headers })
      .then((res) => {
          this.pendingRows = res.data.map(obj => {
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
          this.spinner = false
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
      this.pendingLoading = true
      this.form.startTime = this.newStartTime
      this.form.endTime = this.newEndTime
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
              this.pendingLoading = false
          })
      this.FirstName = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.model = null
    },
    saveApprovals(id){
      console.log(this.model);
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
            }
            if(res.status === 400)
              this.errorMsg = 'Wrong Format'
            this.getPending()
          })
          .catch(err => console.warn(err))
    },
    approveBtn(index){
      this.approveLoading = true
      this.approvedTimeframe.push(index);
      this.approvedIndexClicked = index
      let removeIndex = this.declinedTimeframe.indexOf(index)
      if(removeIndex > -1){
        this.declinedTimeframe.splice(removeIndex, 1)
      }
      axios.put(`https://dev.api.wurk.skyver.co/api/workingtimeframes/${index}/status?status=APPROVED`,
          {}, {headers})
          .then(res => {
            if (res.status === 204)
              this.approveLoading = false
          })
          .catch(err => console.warn(err))
    },
    declineBtn(index){
      this.declineLoading = true
      this.declinedTimeframe.push(index);
      this.declinedIndexClicked = index;
      let removeIndex = this.approvedTimeframe.indexOf(index)
      if(removeIndex > -1){
        this.approvedTimeframe.splice(removeIndex, 1)
      }
      axios.put(`https://dev.api.wurk.skyver.co/api/workingtimeframes/${index}/status?status=DECLINED`,
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
            console.log(this.options[0].label);
          })
    },
    pending(){
      this.status = 'Pending'
      this.approvedTab = false
      this.declinedTab = false
      this.approvalsTab = true
      this.getPending()
    },
    approved(){
      this.status = 'Approved'
      this.approvedTab = true
      this.approvalsTab = false
      this.declinedTab = false
      this.pendingRows = []
      this.approvedTimeframe = []
    },
    declined(){
      this.status = 'Declined'
      this.approvedTab = false
      this.approvalsTab = false
      this.declinedTab = true
      this.pendingRows = []
      this.declinedTimeframe = []
    },
    xBtn(){
      this.errorMsg = ''
    }
  }
}
</script>

<style>
.q-btn>>>.q-icon {
  font-size: 15px;
}
body.desktop .q-focusable:focus .q-focus-helper,
body.desktop .q-hoverable:hover .q-focus-helper {
  background: inherit !important;
  opacity: 0 !important;
}

body .q-field .q-field__control .q-hoverable:hover {
  background: inherit !important;
  opacity: 0 !important;
}
.q-tab__label {
  font-size: 18px;
  font-weight: 700;
}
body{
  font-family: 'Poppins',sans-serif;
}
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:ital,wght@0,400;1,600&display=swap');
</style>
