<template>
  <div>
    <h1>Single Page App</h1>
    <div v-if="!token">
      <!-- Form di login -->
      <h2>Login</h2>
      <input type="text" v-model="loginData.input" placeholder="Username">
      <input type="password" v-model="loginData.password" placeholder="Password">
      <button @click="login">Login</button>

      <!-- Form di registrazione -->
      <h2>Registrazione</h2>
      <input type="text" v-model="registerData.username" placeholder="Username">
      <input type="email" v-model="registerData.email" placeholder="Email">
      <input tyoe="text" v-model="registerData.description" placeholder="Description">
      <input type="password" v-model="registerData.password" placeholder="Password">
      <button @click="register">Registrazione</button>
    </div>

    <div v-if="token">
      <!-- Visualizzazione dei personaggi -->
      <h2>I tuoi personaggi</h2>
      <ul>
        <li v-for="character in characters" :key="character.id">Name: {{ character.name }}   Class: {{ character.class }}   Str: {{character.stats.str.value}}  Dex: {{character.stats.dex.value}}  Int: {{character.stats.int.value}}  Cha: {{character.stats.cha.value}}</li>
      </ul>

      <!-- Creazione di un nuovo personaggio -->
      <h2>Nuovo personaggio</h2>
      <input type="text" v-model="newCharacterData.name" placeholder="Nome">
      <input type="text" v-model="newCharacterData.classe" placeholder="Classe">
      <input type="number" v-model="newCharacterData.stats[0].value" placeholder="Forza">
      <input type="number" v-model="newCharacterData.stats[1].value" placeholder="Destrezza">
      <input type="number" v-model="newCharacterData.stats[2].value" placeholder="Intelligenza">
      <input type="number" v-model="newCharacterData.stats[3].value" placeholder="Carisma">
      <button @click="createCharacter">Crea personaggio</button>
      <button @click="createCClientSide">Crea Client Side</button>

      <!-- Visualizzazione dei gruppi -->
      <h2>I tuoi gruppi</h2>
      <ul>
        <li v-for="group in gruppi" :key="group.id">
          <div>Name: {{ group.name }}  Desc:  {{group.description}}   Code: {{group.code}}   Size: {{group.size}}</div>
        </li>
      </ul>

      <h2>Tutti i gruppi</h2>
      <ul>
        <li v-for="group in gruppiTutti" :key="group.id">
          <div>Name: {{ group.name }}  Desc:  {{group.description}}   Code: {{group.code}}   Size: {{group.size}}</div>
        </li>
      </ul>

      <!-- Ricerca di un gruppo -->
      <h2>Ricerca gruppo</h2>
      <input type="text" v-model="searchGroupQuery" placeholder="Codice del gruppo">
      <div v-if="wasAGroupSearched">Nome: {{searchedGroupData.name}}  Descrizione: {{searchedGroupData.description}}  Size: {{searchedGroupData.size}}
      <select vmodel="selected"> 
        <option disabled value="">Personaggio: </option>
        <option v-for="option in options" :value="option">{{ option }}</option>
      </select>
        <button @click ="() => {requestJoin(resultSet._id, select.value)}">Join</button></div>
      <button @click="searchGroup">Cerca gruppo</button>

      <!-- Creazione di un nuovo gruppo -->
      <h2>Nuovo gruppo</h2>
      <input type="text" v-model="newGroupData.name" placeholder="Nome">
      <input type="text" v-model="newGroupData.description" placeholder="Descrizione">
      <input type="number" v-model="newGroupData.size" placeholder="Grandezza">
      <button @click="createGroup">Crea gruppo</button>
      <button @click="createGClientSide">Crea Client Side</button>

      <!-- Logout -->
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      wasAGroupSearched: false,
      token: null,
      loginData: {
        input: '',
        password: ''
      },
      registerData: {
        username: '',
        email: '',
        description: '',
        password: ''
      },
      characters: [],
      newCharacterData: {
        name: '',
        classe: '',
        stats:[
          {stat:"strength", value:''},
          {stat:"dexterity", value:''},
          {stat:"intelligence", value:''},
          {stat:"charisma", value:''},
        ]
      },
      gruppiTutti: [],
      gruppi: [],
      searchGroupQuery: '',
      newGroupData: {
        name: '',
        description: '',
        size: '',
        code: ''
      },
      searchedGroupData: {
        name: '',
        description: '',
        size: '',
        code: ''
      },
      options: [],
      typeOfOption: {
        name: '',
        class: '',
        id: ''
      },
      selected: ''
    };
  },
  methods: {
    login() {
    let values={
        input:this.loginData.input,
        password:this.loginData.password
    }
    fetch('http://localhost:8080/user/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
            },
            credentials:'include',
            body: JSON.stringify(values)
            
        })
        .then((resp) => {
            resp.json();
            alert("Login avvenuto con sucesso")
            Cookies.set('token', Cookies.get('tk'));
            this.token = true;
        })
    },
    register() {
      axios.post('http://localhost:8080/user/register', this.registerData)
        .then(response => {
          // Registrazione success
          // Puoi effettuare il login automaticamente o mostrare un messaggio di successo
          console.log(response.data);
          this.loginData.input = this.registerData.username;
          this.loginData.password = this.registerData.password;
          this.login();
        })
        .catch(error => {
          // Errore durante la registrazione
          console.error(error);
        });
    },
    logout() {
      // Effettua il logout dell'utente
      this.token=false;
      Cookies.remove('name')
      Cookies.remove('id')
      Cookies.remove('tk')
      Cookies.remove('token')    
      // Cancella il token o i cookie se necessario
    },
    createCharacter() {
      fetch('http://localhost:8080/character',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
                body: JSON.stringify({name: JSON.parse(JSON.stringify(this.newCharacterData.name)), class: JSON.parse(JSON.stringify(this.newCharacterData.classe)), stats: this.newCharacterData.stats}),
            })
            .then((resp) =>
            {
                resp.json();
                if(resp.status === 201)
                    alert('Character created');
            });
    },
    createCClientSide(){
      this.characters.push(JSON.parse(JSON.stringify(this.newCharacterData)));
      console.log(this.characters[0].name)
    },
    searchGroup() {
    fetch('/api/group?code='+this.searchGroupQuery,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        .then((resp) => {
            if (resp.status === 404)
                {alert('Group does not exist')
                wasAGroupSearched = false;}
            else {
                resp.json()
                    .then((data) => {
                        const resultSet=data.data
                        this.searchedGroupData.name = resultSet.name
                        this.searchedGroupData.description = resultSet.description
                        this.searchedGroupData.
                        wasAGroupSearched = true
                        if (Cookies.get('id') && resultSet.master !== Cookies.get('id')) {
                            select: this.selected
                            fetch('/api/character',
                                {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'include'
                                })
                                .then((resp) => resp.json())
                                .then((data) => {
                                    let characters = data.data;
                                    for (let j = 0; j < characters.length; j++) {
                                        this.typeOfOption.name = characters[j].name
                                        this.typeOfOption.class = characters[j].class
                                        this.typeOfOption.id = characters[j]._id
                                    }
                                })
                        } else {
                        }

                    })
            }
        })
    },
    createGroup() {
    nome = JSON.parse(JSON.stringify(this.newGroupData.name))
    description = JSON.parse(JSON.stringify(this.newGroupData.description));
    size = JSON.parse(JSON.stringify(this.newGroupData.size));
    if(!isNaN(parseFloat(size)) && isFinite(size) && size<=5 && size >=1) {
        fetch('/api/group/'
            , {
                method: 'POST'
                ,
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
                body: JSON.stringify({name: nome, description: description, size: size}),
            })
            .then((resp) => {
                resp.json()
                if(resp.status === 201)
                    alert('gruppo creato');
            });
    }else {
        console.log("Size deve essere un numero e deve rispettare i limiti");
        alert("Size deve essere un numero e deve rispettare i limiti");

    }
    },
    createGClientSide(){
      this.newGroupData.code = this.generateCode();
      this.gruppi.push(JSON.parse(JSON.stringify(this.newGroupData)));
      this.gruppiTutti.push(JSON.parse(JSON.stringify(this.newGroupData)));
      console.log(this.gruppi[0].name)
    },
    loadCharacters() {
      // Carica i personaggi dell'utente dal server
      axios.get('/api/character')
        .then(response => {
          this.characters = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    loadGroups() {
      // Carica i gruppi dell'utente dal server
      axios.get('/api/group')
        .then(response => {
          this.gruppi = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    generateCode(){
    let letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length=5;
    let code="";
    for (let i = 0; i < length; i++) {
        code += letters.charAt(Math.floor(Math.random() * 26))
    }
    return code;
  }
  },
  mounted() {
    // Controlla se l'utente è già loggato (potrebbe utilizzare i token o i cookie per verificare l'autenticazione)
    if (Cookies.get('tk')) {
      this.isLoggedIn = true;
      console.log(this.isLoggedIn);
      // Carica i personaggi e i gruppi dell'utente
      //this.loadCharacters();
      //this.loadGroups();
    }
    else{
      this.isLoggedIn = false;
    }
  }
};
</script>
