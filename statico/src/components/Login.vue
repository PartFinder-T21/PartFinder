

<template>
    <form class="app">
      <div v-if="token">
        <p>Already Logged user</p>
        <button @click="logout">LogOut</button>
        <!-- mostra il contenuto per gli utenti loggati -->
      </div>
      <div v-if="!token">
        <!-- mostra il contenuto per gli utenti non loggati -->
        <div class="login">
          <h1>Login</h1>
          <form @submit.prevent="submitLogin">
            <div class="form-group">
              <label for="input">Email</label>
              <input type="text" id="input" v-model="input" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Login</button>
          </form>
          <p v-if="error">{{ error }}</p>
        </div>
      </div>
    </form>
  </template>
  
  <script>
  import axios from "axios";
  import Cookies from "js-cookie";

  
  export default {
    data() {
      return {
        input: "",
        password: "",
        error: "",
        token: null,
      };
    },
    mounted() {
      // leggi il token dal cookie quando il componente viene montato
      this.token = Cookies.get("token");
    },
    methods: {
      async submitLogin() {
        try {
          let response = await axios.post("http://localhost:8080/user/login", {
            input: this.input,
            password: this.password,
          });
          alert(response.data.status);
          if (response.data.status === 200) {
            // login successful
            // save the token in the cookie
            Cookies.set("token", response.data.tk);
            // update the token in the data
            this.token = Cookies.get("token");
            // redirect to home page or do something else
            console.log(response.data.username);
            alert("Login fatto!");
            this.$router.push('/')

          }
        } catch (error) {
          // login failed
          // show error message
          this.error = error.response.data.message;
          alert("Username e/o password errati");
        }
      },
      logout()  {
        Cookies.remove("tk");
        this.token=null;
      }
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
