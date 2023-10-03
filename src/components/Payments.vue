<template>
<div>
  <div v-if="spinner">
    <q-inner-loading
        showing
        color="secondary"
    />
  </div>
  <q-btn label="Make a payment" no-caps color="primary" class="absolute-top-right q-mr-xl"
         style="margin-top: 105px; margin-right: 83px; border-radius: 10px; font-size: 16px" @click="openAddPaymentModel" />
  <q-list separator v-if="showWorkingHistory" class="q-pt-xl q-pl-xl q-ma-xl q-pb-xl"
          style="max-width: 1500px; margin-left: 3%">
    <q-item align="left">
      <q-item-section><strong>Payment Time</strong></q-item-section>
      <q-item-section><strong>Amount</strong> </q-item-section>
      <q-item-section><strong>User Name </strong></q-item-section>
      <q-item-section><strong>Notes</strong></q-item-section>
      <q-item-section><strong>Action</strong></q-item-section>
    </q-item>
    <q-list style="margin-bottom: 12px; border-radius: 30px" class="bg-white" v-for="rowData in paymentsForm"
            :key="rowData.id">
      <q-item style="padding: 25px 25px" align="left">
        <q-item-section>{{ rowData.paymentTime }}</q-item-section>
        <q-item-section>{{ rowData.amount }}</q-item-section>
        <q-item-section>{{ rowData.userName }}</q-item-section>
        <q-item-section>
          <div style="inline-size: 200px; overflow-wrap: break-word">
            <q-card-section v-if="rowData.notes.length <= 10">
              {{ rowData.notes }}
            </q-card-section>
            <q-expansion-item
                :label="rowData.notes.slice(0, 13) + '...'"
                 v-else
            >
              <q-card>
                <q-card-section>
                  {{ rowData.notes }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-item-section>
        <q-item-section>
          <q-icon class="q-ml-md" name="far fa-edit" size="20px" title="Edit"
                  style="cursor: pointer"/>
        </q-item-section>
      </q-item>
    </q-list>
  </q-list>
  <div v-else class="col-12 text-center self-center">
    <p>No data available</p>
  </div>
  <div v-if="paymentsForm.length < 1" class="col-12 text-center self-center">
    No Data
  </div>
  <q-dialog v-model="addPaymentModel" persistent >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add Payment</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <br />

      <q-card-section class="q-pt-none">
        <q-form @submit="addPayment">
          <q-input outlined v-model="form.paymentDate" label="Pick Date And Time"
                   :rules="[val => !!val || 'Payment date & time is required']">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.paymentDate" mask="YYYY-MM-DD HH:mm" v-if="showDate" :options="optionsFn">
                    <div class="row items-center justify-end">
                      <q-btn label="Close" color="primary" flat @click="closeDate" />
                    </div>
                  </q-date>
                  <q-time v-model="form.paymentDate" mask="YYYY-MM-DD HH:mm" format24h v-if="showTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>

          </q-input>
          <q-input v-model.number="form.amount" type="number" label="Amount" outlined
                   :rules="[val => !!val || 'Amount is required']"
                   style="margin-bottom: 8px"
          />
          <q-input v-model="form.notes" type="textarea" outlined label="Notes" />
          <q-card-actions align="right">
            <q-btn color="primary" type="submit" no-caps label="Add Payments" />
            <q-btn color="dark" no-caps label="Cancel" v-close-popup outline />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  </div>
</template>

<script>
import getProjects from "src/common/getProjects";
import dayjs from 'dayjs'
import {ref} from "vue";
import {useQuasar, date} from "quasar";
const auth = localStorage.getItem('authorization');
export default {
  name: "payments",
  setup () {
    const modalActive = ref(true)
    const $q = useQuasar()
    return {
      optionsFn (d) {
        return d >= date.formatDate(Date.now(), 'YYYY/MM/DD')
      },
      modalActive,
      triggerAddMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Payment was added successfully.',
          position,
        })
      },
    }
  },
  data(){
    return{
      showTop: true,
      spinner: false,
      showWorkingHistory: true,
      paymentsForm:  [],
      form:{
          paymentDate: "",
          amount: Number,
          notes: "",
      },
      paymentsAmount: '',
      userId: this.$route.params.id,
      addPaymentModel: false,
      showTime: false,
      showDate: true
    }
  },
  mounted() {
    this.getPaymentsById()
  },
  methods:{
    closeDate(){
      this.showTime = true
      this.showDate = false
    },
    clearFrom(obj){
      for (const key in obj) {
        obj[key] = "";
      }
    },
    getPaymentsById(){
      this.spinner = true
      if(this.spinner === true){
        this.showWorkingHistory = false
        this.showTop = false
      }
        getProjects.getPaymentById(this.userId)
        .then(res => {
          if(res.status === 200){
            this.showTop = true
            this.spinner = false
            this.showWorkingHistory = true
          }
          this.paymentsForm = res.data.map((obj) => {
            const paymentTime = dayjs(obj.paymentTime).format('YYYY-MM-DD HH:mm')
            return{
              id: obj.id,
              paymentTime: paymentTime,
              amount: obj.amount,
              userName: obj.userName,
              notes: obj.notes
            }
          })
        })
    },
    addPayment(){
      this.showTime = false
      this.showDate = true
      const oldDateTime = dayjs(this.form.paymentDate).format('YYYY-MM-DDTHH:MM:ss.sss') + 'Z'
      console.log(this.$route.params.id);
      fetch(`https://dev.api.wurk.skyver.co/api/payments/${this.userId}/pay`, {
        method: 'POST',
        headers: new Headers({
          "Accept": "application/json",
          'Content-Type': 'application/json',
          "Authorization": auth
        }),
        body: JSON.stringify({
          id: this.userId,
          paymentTime: oldDateTime,
          amount: this.form.amount,
          notes: this.form.notes,
        })
      })
      .then((res) => {
        if(res.status === 201){
          this.addPaymentModel = false
          this.getPaymentsById()
          this.triggerAddMessage('top-right');
        }
      })
      // const body = {
      //   id: this.userId,
      //   paymentDate: "2022-04-05",
      //   amount: 0,
      //   notes: "a",
      // }
      // getProjects.addPayment(body)
      // .then(res => console.log(res.data))
    },
    openAddPaymentModel(){
      this.clearFrom(this.form)
      this.addPaymentModel = true
    }
  }
}
</script>

<style scoped>
*{
  margin: 0;
}
</style>