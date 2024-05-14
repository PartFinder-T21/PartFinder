<script>
  import Cookies from 'js-cookie'
  import {API_URL} from "@/main";

    export default {
    data() {
      return {
        gruppi: [],
        gruppiMaster: [],
        gruppiPlayer: [],
        personaggi: [],
        codice: '',
        selected: '',
        tmp: ''
      }
    },
    methods: {
      caricaPgs(){
            this.personaggi=[];
            fetch(API_URL+'/character',
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'
            },
            credentials:'include'
        })
        .then((resp) => resp.json())
        .then((data)=>{
            for(let i=0; i<data.data.length; i++){
                    this.personaggi.push(data.data[i])
            }
        })
      },
      cercaGruppo(){
            this.gruppi=[];
            fetch(API_URL+'/group?code='+this.codice,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        .then((resp) => {
            if (resp.status === 404)
                alert('Group does not exist')
            else {
                resp.json()
                    .then((data) => {
                      this.gruppi.push(data.data);
                    })}})
      },

      async ccercaGruppo(){
        this.gruppi=[];
          this.gruppiMaster = [],
          this.gruppiPlayer = [];
          let resp2 = await fetch(API_URL+'/group?code='+this.codice,
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
          });
          let data2 = await resp2.json();
          if(resp2.status === 404)
              alert('Il gruppo cercato non esiste')
          else{
            this.gruppi.push(data2.data);

          let resp3 = await fetch(API_URL+'/user?id='+this.gruppi[0].master,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
              credentials:'include',
            });
            if(resp3.status === 200 ){
              let data3 = await resp3.json();
              this.gruppiMaster.push(data3.username);
            }
            this.gruppiPlayer.push([]);
            console.log("BBB"+this.gruppi[0])
            for(let j=0; j<this.gruppi[0].characters.length; j++){
              console.log("AAA"+this.gruppi[0].characters[j])
              let resp4 = await fetch(API_URL+'/user?id='+this.gruppi[0].characters[j].user,
              {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
              });
              if(resp4.status === 200 ){
                let data4 = await resp4.json();
                console.log(data4.username);
                this.gruppiPlayer[0].push(data4.username);
              }
            
          }}
      },

      inviaRichiesta(id){
        let send={
        character:this.selected,
        id:id
    }
    fetch(API_URL+'/group/request',
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
            },
            credentials:'include',
            body: JSON.stringify(send)
        })
        .then((resp)=>{
            if(resp.status === 201)
                alert('richiesta inviata')
            else{
                resp.json()
                    .then((data)=>{
                        alert(JSON.stringify(data));
                    })
            }
        })
      },

      control(master, array){
        let a=true
          array.forEach(element => {
            if(Cookies.get('id') === element.user){
              a=false;
            }
          });
        return((Cookies.get('id') != master) && a)
      }
    },
    
    mounted(){
        this.caricaPgs();
    }
  }

</script>

<template>
  <main>
        <div class="wrapper">
            <nav>    

                <RouterLink to="/gruppi/crea">Crea</RouterLink>
                <RouterLink to="/gruppi/cerca">Cerca</RouterLink>
                <RouterLink to="/gruppi/mostraTutti" @click="caricaPgs">Mostra Tutti</RouterLink>
                <RouterLink to="/gruppi/mostraMiei">Gruppi Personali</RouterLink>

            </nav>  
        </div>

        <laber for="Code">Codice</laber>
        <input type="text" id="Code" v-model="codice">
        <button @click="ccercaGruppo" class="cerca">MOSTRA</button>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrizione</th>
              <th>Codice</th>
              <th>Master</th>
              <th>Player1</th>
              <th>Player2</th>
              <th>Player3</th>
              <th>Player4</th>
              <th>Player5</th>
              <th>Richiesta</th>
           </tr>
          </thead>
        <tbody>
          <tr v-for="item in gruppi">
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.code }}</td>
            <td>{{ gruppiMaster[gruppi.indexOf(item)] }} </td>
            <td v-for="player in item.characters"> {{ gruppiPlayer[gruppi.indexOf(item)][item.characters.indexOf(player)] }} </td>
            <td v-for="request in item.requests">Prenotato</td>
            <td v-for="(value, index) in 5 - (item.characters.length + item.requests.length)"> X </td>
            <template v-if="(5 - (item.characters.length + item.requests.length))!=0 && control(item.master, item.requests) ">
              <button @click="inviaRichiesta(item._id)" class="delete"> INVIA RICHIESTA </button>
              <select v-model="selected">
                <option disabled value="">Seleziona personaggio per richiesta</option>
                <option v-for="option in personaggi" :value="option._id">{{ option.name }}</option>
              </select>
            </template>
            <template v-else>
              <td>RICHIESTA NON DISPONIBILE</td>
            </template>
          </tr>
        </tbody>
        </table>

  </main>
</template>

<style>
  .cerca{
        margin-bottom: 50px;
  }
 .sottotitolo {
        margin-bottom: 20px;
        margin-top: 40px ;
 }

 .delete {
        background-color: transparent;
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-radius: 0px;
    }

 /* Stile per la tabella */
 table {
    width: 100%;
    border-collapse: collapse;
    color: white; /* Colore del testo */
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  
  th {
    background-color: #333; /* Colore di sfondo delle intestazioni */
    font-weight: bold;
    border-top: 1px solid #ddd;
  }
  
  /* Stile per le righe dispari */
  tr:nth-child(odd) {
    background-color: #222; /* Colore di sfondo delle righe dispari */
  }
  
 /* Stile per la tabella */
 table {
    width: 100%;
    border-collapse: collapse;
    color: white; /* Colore del testo */
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  
  th {
    background-color: #333; /* Colore di sfondo delle intestazioni */
    font-weight: bold;
    border-top: 1px solid #ddd;
  }
  
  /* Stile per le righe dispari */
  tr:nth-child(odd) {
    background-color: #222; /* Colore di sfondo delle righe dispari */
  }
  
  /* Stile per la linea verticale tra le colonne */
  td:first-child, th:first-child {
    border-left: 1px solid #ddd;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.title {
text-align: center;
color: #66ff66;
font-size: 30px;
margin-bottom: 20px;
}

.testo{
text-align: center; 
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
  </style>
  