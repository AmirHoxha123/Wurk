<template>
  <div>
    <div class="column inline items-start example-container q-ma-xl">
      <div class="example-cell" tabindex="0">
        <img :src="wurkLogo" alt="Wurk logo" width="120" height="110" />
      </div>
      <div class="example-cell" tabindex="0">
        <p class="heading" style="margin-top: 25px">WURK</p>
      </div>
    </div>
    <p class="heading" style="font-size: 45px; margin-left: 70px">Lorem Ipsum Dolores</p>
    <div class="fixed-right q-mr-xl" style="z-index: 999;">
      <q-card class="q-pa-md absolute-center" style="width: 500px" id="container">
        <q-form
            @submit="onSubmit()"
            class="q-gutter-md"
            style="padding: 8px"
        >
          <h4 style="margin: 80px 14px 8px" class="heading"><strong>Sign in</strong></h4>
          <p style="padding-bottom: 15px">Login to manage your account</p>
          <label>Phone number</label>
          <q-input
              class="inputColor"
              color="white"
              type="number"
              outlined
              v-model="posts.phoneNumber"
              lazy-rules
              :rules="[ val => val !== null && val !== '' || 'Please type your phone number',]"
          >
            <template v-slot:prepend>
              <q-icon name="ion-call" color="white" size="35px" />
            </template>
          </q-input>
          <label>Password</label>
          <q-input v-model="posts.password"
                   outlined color="white"  class="inputColor"
                   :input-style="{ color: 'white' }"
                   :type="isPwd ? 'password' : 'text'"
                   :rules="[
                    val => val !== null && val !== '' || 'Please type your password'
                  ]"
          >
            <template v-slot:prepend>
              <q-icon name="ion-lock" color="white" size="35px" />
            </template>
            <template v-slot:append>
              <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer" color="white"
                  @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <p class="error-message">{{ ErrorMessage }}</p>
          <div>
            <q-btn  type="submit"
                    class="full-width bg-white"
                    style="font-size: 18px; color: #1976D2; border-radius: 15px"
                    label="Sign in"
            ></q-btn>
            <div class="flex justify-center q-mt-xl">
              <p style="text-decoration: underline">Forgot password ?</p>
            </div>
            <q-inner-loading :showing="loading" style="background: none">
              <q-spinner size="50px" color="white" />
            </q-inner-loading>
          </div>
        </q-form>
      </q-card>
    </div>
    <div class="row absolute-bottom q-ml-xl q-mt-xl">
      <img class="col-5 offset-1" :src="workersImage" alt="workers" >
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import wurkLogo from 'src/assets/wurkLogoNoBg – 1.png'
import workersImage from 'src/assets/Frame.svg'
import axios from 'axios'

export default {
  name: "Login",
  data() {
    const leftDrawerOpen = ref(false)

    const phoneNumber = ref(null)
    const password = ref(null)
    const accept = ref(false)

    return {
      posts: {
        phoneNumber,
        password
      },
      workersImage: workersImage,
      wurkLogo: wurkLogo,
      number: null,
      isPwd: ref(true),
      type: 'password',
      ErrorMessage: '',
      accept,
      leftDrawerOpen,
      loading: false
    }
  },
  methods: {
     onSubmit() {
      let encode =  window.btoa(this.posts.phoneNumber + ':' + this.posts.password)
      let authorization = 'Basic ' + encode
      localStorage.setItem('authorization', authorization)
      this.loading = true;

      axios.get('https://dev.api.wurk.skyver.co/api/admins', {
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application.json',
          "Authorization": authorization
        }
      })
          .then((res) => {
            if(res.status === 200)
              this.$router.replace({path: '/projects'})
          })
          .catch((err) => {
            if(err.response.status === 401) {
              this.ErrorMessage = 'Wrong phone number or password'
            }else {
              this.ErrorMessage = err
            }

          })
          .finally(() => {
            this.loading = false
          })
    },
  }
}
</script>
<style>
.q-field--outlined .q-field__control:before {
  border: 1px solid #9FB7E0;
}
.q-field--outlined:hover .q-field__control:before {
  border-color: white;
}
body{
  background: linear-gradient(112.44deg, #0D3352 3.17%, rgba(0, 55, 165, 0.56) 94.28%);
}
.heading{
  color: white;
  font-size: 32px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
#container{
  color: white;
  background: linear-gradient(145.94deg, #6b89bf -13.21%, rgba(255, 255, 255, 0) 131.41%);
  border-radius: 45px;
  position: relative;
}
.error-message{
  font-size: 18px;
  color: red;
  margin-top: -5px;
}
input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  color: white;
}
input[type="password"]{
  color: white
}
body{
  background-repeat: repeat;
  background-attachment: fixed;
}
</style>

<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  width: 0 !important

.example-container
  height: 100px

  .example-cell
    padding: 4px 8px
</style>