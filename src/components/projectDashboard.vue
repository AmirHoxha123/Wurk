<template>
  <div class="q-ma-xl" style="font-size: 20px">
    <div v-if="showLoading" class="fixed-center">
      <q-spinner
          color="primary"
          size="3em"
      />
    </div>
    <p>Project Name: {{ form.name }},</p>
    <p>Project Location: {{ form.location }},</p>
    <p>Start Date: {{ form.startDate }},</p>
    <p>End Date: {{ form.endDate }},</p>
    <p>Total Hours: 1203</p>
  </div>
</template>

<script>
import getProjects from "src/common/getProjects";
import dayjs from "dayjs";

export default {
  name: "projectExpenses",
  data(){
    return{
      id: this.$route.params.id,
      showLoading: false,
      form:{
        name: "",
        location: "",
        startDate: "",
        endDate: "",
        hoursWorked: "",
        id: "",
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
            this.form.name = res.data.name
            this.form.location = res.data.location
            this.form.startDate = dayjs(res.data.startDate).format('DD-MM-YYYY');
            this.form.endDate = dayjs(res.data.endDate).format('DD-MM-YYYY');
            this.form.id = res.data.id
            if(res.status === 200)
              this.showLoading = false
          })
    },
  }

}
</script>

<style scoped>

</style>