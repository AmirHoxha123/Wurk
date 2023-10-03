<template>
<div>
  <q-btn label="Add Expanses" @click="addExpenses" no-caps color="primary" class="absolute-top-right q-mr-xl"
         style="margin-top: 105px; margin-right: 83px"/>
  <div v-if="getExpenseLoading" class="fixed-center">
    <q-spinner
        color="primary"
        size="3em"
    />
  </div>
    <q-dialog v-model="addExpenseDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <div v-if="expenseLoading" class="fixed-center">
          <q-spinner
              color="primary"
              size="3em"
          />
        </div>
        <q-card-section class="row items-center">
          <div class="text-h6" v-if="addExpensesText">Add Expenses</div>
          <div class="text-h6" v-else>Edit Expenses</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
          <q-card-section class="q-pt-none">
            <q-form @submit="onSubmit()">
              <q-input v-model="expensesForm.title" label="Title" outlined
                       :rules="[val => !!val || 'Title is required']"
                       style="margin-bottom: 8px"
                       />
              <q-input v-model="expensesForm.quantity" label="Quantity" outlined
                       style="margin-bottom: 8px" type="number"
              />
              <br>
              <q-input v-model.number="expensesForm.price" type="number" label="Price" outlined
                       :rules="[val => !!val || 'Price is required']"
                       style="margin-bottom: 8px"
              />
              <q-input v-model="expensesForm.notes" type="textarea" outlined />
              <q-card-section align="center">
                <q-btn color="dark" no-caps label="Cancel" style="margin-left: 10px"
                       v-close-popup outline class="float-right" />

                <q-btn color="primary" type="submit" no-caps label="Add" class="float-right" v-if="addExpensesText"  />
                <div  v-else>
                  <q-btn color="primary" no-caps label="Save" class="float-right" @click="saveExpense(expensesForm.id)" />
                  <q-btn color="negative" no-caps label="Delete" class="float-left"
                         @click="deleteExpenses(expensesForm.id)"  />
                </div>
              </q-card-section>
              <br />
            </q-form>
          </q-card-section>
      </q-card>
    </q-dialog>
  <q-list class="q-pt-md q-pl-xl q-ma-xl q-pb-xl" style="max-width: 1500px">
    <q-item>
      <q-item-section><strong>Title</strong></q-item-section>
      <q-item-section><strong>Quantity</strong></q-item-section>
      <q-item-section><strong>Price</strong></q-item-section>
      <q-item-section><strong>Notes</strong></q-item-section>
      <q-item-section><strong>Edit Expenses</strong></q-item-section>
    </q-item>
    <q-list style="margin-bottom: 12px; border-radius: 30px;" v-for="row in expenses" :key="row" class="bg-white">
      <q-item style="padding: 25px 25px">
        <q-item-section>{{ row.title }}</q-item-section>
        <q-item-section>{{ row.quantity }}</q-item-section>
        <q-item-section>{{ row.price }} </q-item-section>
        <q-item-section>
          <div style="inline-size: 200px; overflow-wrap: break-word;">
              <q-card-section  v-if="row.notes.length <= 10">
                {{ row.notes }}
              </q-card-section>
            <q-expansion-item
              :label="row.notes.slice(0, 14) + '...'"
              v-else
          >
            <q-card>
              <q-card-section>
                {{ row.notes }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          </div>
        </q-item-section>
        <q-item-section class="q-pl-lg">
          <q-icon class="q-ml-md" name="far fa-edit" size="20px" title="Edit"
                  style="cursor: pointer" @click="editExpense(row.id)" />

        </q-item-section>
      </q-item>
      </q-list>
    </q-list>
    <div v-if="expenses.length < 1" class="q-pt-xl" style="margin: auto; width: 10%;">
      No Data
    </div>
  </div>
</template>

<script>
import {useQuasar} from "quasar";
const auth = localStorage.getItem('authorization');
const expensesUrl = 'https://dev.api.wurk.skyver.co/api/expenses';
const headers = {
  "Accept": "application/json",
  'Content-Type': 'application.json',
  "Authorization": auth
}
import fetchProjectExpenses from "src/common/fetchProjectExpenses";
export default {
  setup () {
    const $q = useQuasar();
    return {
      triggerAddExpenseMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Expense was added successfully.',
          position,
        })
      },
      triggerDeleteExpenseMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Expense was deleted successfully.',
          position,
        })
      },
      triggerExpenseUpdateMessage (position) {
        $q.notify({
          type: 'positive',
          message: 'Expense was updated successfully.',
          position,
        })
      }
    }
  },
  name: "projectExpenses",
  data(){
    return{
      id: this.$route.params.id,
      addExpenseDialog: false,
      editExpenseDialog: false,
      expenseLoading: false,
      addExpensesText: true,
      getExpenseLoading: false,
      expenses: [],
      expensesForm:{
        title: "",
        quantity: "",
        price: "",
        notes: "",
        projectId: this.id,
        id: "",
      }
    }
  },
  mounted() {
    this.getExpense()
  },
  methods:{
    getExpense(){
      this.getExpenseLoading = true
      fetchProjectExpenses.getExpensesById(this.id)
      .then(res => {
        this.expenses = res.data
        if(res.status === 200)
          this.getExpenseLoading = false
      })
    },
    addExpenses(){
      this.addExpensesText = true
      this.addExpenseDialog = true;
      this.clearExpensesForm()
    },
    onSubmit(){
      fetch(expensesUrl, {
        method: 'POST',
        headers: new Headers({
          "Accept": "application/json",
          'Content-Type': 'application/json',
          "Authorization": auth
        }),
        body: JSON.stringify({
            title: this.expensesForm.title,
            quantity: this.expensesForm.quantity,
            price: this.expensesForm.price,
            notes: this.expensesForm.notes,
            projectId: this.id
        })
      })
      .then(res => {
        this.getExpense()
        if(res.status === 201){
          this.addExpenseDialog = false;
          this.triggerAddExpenseMessage('top-right');
        }
      })
    },
    editExpense(id){
      this.addExpensesText = false
      this.expenseLoading = true
      this.clearExpensesForm()
      this.addExpenseDialog = true
      fetchProjectExpenses.getExpensesId(id)
          .then(res => {
            this.expensesForm.title = res.data.title;
            this.expensesForm.quantity = res.data.quantity;
            this.expensesForm.price = res.data.price;
            this.expensesForm.notes = res.data.notes;
            this.expensesForm.id = res.data.id;
            console.log(res.data.title);
            if(res.status === 200)
              this.expenseLoading = false
          })
    },
    saveExpense(id){
      fetch(`${expensesUrl}/${id}`, {
        method: 'PUT',
        headers: new Headers({
          "Accept": "application/json",
          'Content-Type': 'application/json',
          "Authorization": auth
        }),
        body: JSON.stringify(this.expensesForm)
      })
          .then((res) => {
            if (res.status === 204) {
              this.triggerExpenseUpdateMessage('top-right')
              this.addExpenseDialog = false;
              this.getExpense();
            }
          })
    },
    deleteExpenses(){
      fetchProjectExpenses.deleteExpense(this.expensesForm)
      .then(res => {
        console.log(res.data)
        if(res.status === 204){
          this.triggerDeleteExpenseMessage('top-right')
          this.addExpenseDialog = false
        }
        this.getExpense()
      })
    },
    clearExpensesForm(){
      this.expensesForm.title = ""
      this.expensesForm.quantity = ""
      this.expensesForm.price = ""
      this.expensesForm.notes = ""

    }
  },
}
</script>

<style scoped>

</style>