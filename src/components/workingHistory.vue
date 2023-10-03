<template>
  <div class="q-pa-md">
    <div v-if="spinner">
      <q-inner-loading
          showing
          color="secondary"
      />
    </div>
    <q-list separator v-if="showWorkingHistory" class="q-pl-xl q-ma-xl">
      <q-item v-if="noData" align="left" class="q-ml-lg">
        <q-item-section><strong>Date</strong> </q-item-section>
        <q-item-section><strong>Project</strong> </q-item-section>
        <q-item-section><strong>Start Time</strong></q-item-section>
        <q-item-section><strong>End Time</strong></q-item-section>
        <q-item-section><strong>Duration</strong></q-item-section>
        <q-item-section><strong>Working Status</strong></q-item-section>
      </q-item>
      <q-list style="margin-bottom: 12px; border-radius: 30px" class="bg-white" v-for="row in rows" :key="row">
        <q-item style="padding: 25px 25px" align="left" class="q-ml-md">
          <q-item-section>{{ row.date }}</q-item-section>
          <q-item-section >
            {{ row.projectName }}
            <br />
            <div style="font-size: 12px; color: #696969;">
              {{ row.projectLocation }}

            </div>
          </q-item-section>
          <q-item-section>{{ row.startTime }}</q-item-section>
          <q-item-section>{{ row.endTime }}</q-item-section>
          <q-item-section>{{ row.duration }}</q-item-section>
          <q-item-section v-if="row.status === 'WORKING'">
            <q-item-label>
              <q-btn style="background-color: #16c86c; color: white; font-size: 14px;"
                     rounded padding="2px 12px" no-caps
              >Working now</q-btn>
            </q-item-label>
          </q-item-section>
          <q-item-section  />
        </q-item>
      </q-list>
    </q-list>
    <div v-else class="col-12 text-center self-center">
      <p>No data available</p>
    </div>

  </div>
</template>

<script>
const auth = localStorage.getItem('authorization');
import axios from "axios";
import dayjs from "dayjs";

export default {
  name: "workingHistory",
  data(){
    return {
      rows: [],
      showWorkingHistory: true,
      noData: true,
      spinner: false,
    }
  },
  mounted() {
    this.getWorkingHistoryData()
  },
  methods:{
    getWorkingHistoryData(){
      this.spinner = true
      if(this.spinner === true){
        this.showWorkingHistory = false
      }
      const id = this.$route.params.id;
      axios.get(`https://dev.api.wurk.skyver.co/api/workingtimeframes/employees/${id}`, {
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application.json',
          "Authorization": auth
        },
      })
          .then((res) => {
            this.rows = res.data.map(obj => {
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
                date: this.newDate,
                projectLocation: obj.projectLocation,
                projectName: obj.projectName,
                startTime: this.newStartTime,
                endTime: this.newEndTime,
                duration: this.newDuration,
                status: obj.status
              }

            })
            if(res.status === 200)
              this.spinner = false
          })
          .finally(() => {
            if(!this.rows.length)
              this.showWorkingHistory = false
            else
              this.showWorkingHistory = true
          })

    },
  }
}
</script>

<style scoped>

</style>