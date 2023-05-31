<template>
    <form class="app">
      <div v-if="!token">
        <div class="login">
          <h1>Register</h1>
          <form @submit.prevent="submitRegister">
            <div class="form-group">
              <label for="input">Email</label>
              <input type="text" id="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="input">UserName</label>
              <input type="text" id="userName" v-model="username" required />
            </div>
            <div class="form-group">
              <label for="input">Description</label>
              <input type="text" id="desc" v-model="description" required />
            </div>
            <div class="form-group">
              <label for="input">Password</label>
              <input type="password" id="password" v-model="password" required />
            </div>
            <div class="form-group">
              <label for="password">Repeat Password</label>
              <input type="password" id="password2" v-model="password2" required />
            </div>
            <button type="submit">Register</button>
          </form>
          <p v-if="error">{{ error }}</p>
        </div>
      </div>
    </form> 
</template>

<script>
  import axios from "axios";
  import Cookies from "js-cookie";
  import { defineComponent } from 'vue'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { watch } from 'vue'
  import { ref } from "vue"



  
  export default {
    setup(){

      const cookies = useCookies('token')
      const token = null;

      watch(
        () => cookies.get('token'),
        ([currentToken],[oldToken])=> {
            console.log("Cookie cambiato")
            this.token = currentToken;
        },
        {deep: true}
    )
    },
    data() {
      return {
        username: "",
        description: "",
        email: "",
        password: "",
        password2: "",
        error: "",
        token: null,
      };
    },
    mounted() {
      // leggi il token dal cookie quando il componente viene montato
        this.token = Cookies.get("token");
    },
    changeToken(){
        console.log("ciao");
        this.token = Cookies.get("token");
    },
    methods: {
      async submitRegister() {

        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/;
        console.log(this.password + " " + this.password2)
        if(regex.test(this.password) && this.password===this.password2){
        try {
          let response = await axios.post("http://localhost:8080/user/register", {
            username: this.username,
            password: this.password,
            description: this.description,
            email: this.email,
          });

          if (response.status == 201) {
            alert("Registrazione effettuata, si può eseguire il login")
            this.$router.push('/login')
          }
        } catch (error) {
          // register failed
          // show error message
          this.error = error.response.data.message;
          alert('username o email non è univoco')
        }
        }
        else{
            console.log("La password non soddisfa i criteri richiesti:\n" +
            "al meno 6 caratteri\n" +
            "al meno una lettera maiuscola\n" +
            "al meno una lettera minuscola\n" +
            "al meno un numero\n" +
            "al meno un carattere speciale tra (@$!%*?&_)\n" +
            "la password e la conferma password devono essere uguali\n");
        alert("La password non soddisfa i criteri richiesti:\n" +
            "al meno 6 caratteri\n" +
            "al meno una lettera maiuscola\n" +
            "al meno una lettera minuscola\n" +
            "al meno un numero\n" +
            "al meno un carattere speciale tra (@$!%*?&_)\n" +
            "la password e la conferma password devono essere uguali\n");
        }
      },
    }, 
  };

</script>

<style scoped>

  
.login {
  width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
}

input {
  width: 100%;
  padding: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
}

.error {
  color: red;
}
</style>
