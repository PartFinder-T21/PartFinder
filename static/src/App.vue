<script>
import { RouterLink, RouterView, routerKey } from 'vue-router'
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie';
import {API_URL} from "@/main";


export default{
    data() {
        return {
          token: false,
            loginData: {
                loginMail: "",
                loginPass: "",
            },
            registerData: {
                regMail: "",
                regName: "",
                regDesc: "",
                regPass: "",
                regPass1: "",
            },
            Utente: '',
        };
    },
    methods: {
        async login() {
            let values = {
              input: this.loginData.loginMail,
              password: this.loginData.loginPass
            };
            let resp = await fetch(API_URL+"/user/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
              },
            credentials: "include",
              body: JSON.stringify(values)
            });
            if (resp.status === 200) {
              await resp.json();
              alert("Login avvenuto con sucesso");
              this.token=true;
              this.Utente = Cookies.get('name');
            }
            else if (resp.status === 400) {
              alert("Email o password errati");
            }
          },

        register() {
            var email = this.registerData.regMail;
            var username = this.registerData.regName;
            var description = this.registerData.regDesc;
            var password = this.registerData.regPass;
            var password2 = this.registerData.regPass1;
            let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/;
            let send = {
                email: email,
                username: username,
                description: description,
                password: password
            };
            if (regex.test(password) && password === password2) {
                fetch(API_URL+"/user/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(send),
                })
                    .then((resp) => {
                    resp.json();
                    if (resp.status === 201)
                        alert("utente registrato");
                    else if (resp.status === 400)
                        alert("username o email non è univoco");
                });
            }
            else {
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
        logout() {
            this.token = false;
            Cookies.remove("name");
            Cookies.remove("id");
            Cookies.remove("tk");
        },
    },
    mounted() {
        if (Cookies.get("tk"))
            this.token = true;
        else
            this.token = false;
        console.log(this.token);
    },
    components: { routerKey }
}
</script>

<template>
  <header>
    <h1 class="title">PARTFINDER</h1>
    <div class="intern" v-if="!token">
      <div class="form-title-login">LOGIN</div>

      <label for="loginMail">Email/Username</label>
      <input type="text" v-model="loginData.loginMail" id="loginMail">

      <label for="loginPass">Password</label>
      <input type="password" v-model="loginData.loginPass" id="loginPass">

      <button @click="login">Login</button>



      <div class="form-title-register">REGISTER</div>

      <label for="regMail">Email</label>
      <input type="text" v-model="registerData.regMail" id="regMail">

      <label for="regName">Username</label>
      <input type="text" v-model="registerData.regName" id="regName">

      <label for="regDesc">Description</label>
      <input type="text" v-model="registerData.regDesc" id="regDesc">

      <label for="regPass">Password</label>
      <input type="password" v-model="registerData.regPass" id="regPass">

      <label for="regPass1">Repeat Password</label>
      <input type="password" v-model="registerData.regPass1" id="regPass1">

      <button @click="register">Register</button>
    </div>
      <div class="wrapper" v-if="token">

        <nav>
          <RouterLink to="/home">Home</RouterLink>
          <RouterLink to="/gruppi">Gruppi</RouterLink>
          <RouterLink to="/personaggi">Personaggi</RouterLink>
          <RouterLink class="hovered" to="/" @click="logout">Logout</RouterLink>
        </nav>

        <div>Benvenuto {{Utente}}</div>
      </div>
    </header>
    <RouterView />
</template>


<style>
body {
  background-color: #333;
  color: #fff;
}

header {
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
}

.title {
  text-align: center;
  color: #66ff66;
  font-size: 30px;
  margin-bottom: 20px;
}

.intern {
  margin: 20px auto;
  padding: 20px;
  width: 300px;
  background-color: #222;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.2);
}

.form-title-login,
.form-title-register {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-title-register {
  margin-top: 30px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 96%;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #222;
  color: #fff;
}

button {
  display: block;
  margin: 0 auto;
  width: 60%;
  padding: 10px;
  background-color: #66ff66;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.2);
}

button:hover {
  background-color: #33cc33;
}

.hovered:hover {
  text-decoration: underline;
  cursor:pointer;
}

.navi {
  text-align: center;
  margin-top: 20px;
}

nav {
  min-width: 400px;
  display: inline-block;
}

nav a {
  margin-right: 10px;
  color: #fff;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

</style>
