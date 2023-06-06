<script>
  import Cookies from 'js-cookie'

    export default {
    data() {
      return {
        gruppiMaster: [],
        gruppiMasterMaster: [],
        gruppiMasterPlayer: [],
        gruppiPlayer: [],
        gruppiPlayerMaster: [],
        gruppiPlayerPlayer: [],
        richiestaNome: '',
        tmp: ''
      }
    },
    methods: {
      async visualizzaGruppi(){
          this.gruppiMaster=[];
          this.gruppiMasterMaster = [],
          this.gruppiMasterPlayer = [];
          this.gruppiPlayer=[];
          this.gruppiPlayerMaster = [],
          this.gruppiPlayerPlayer = [];
          let resp2 = await fetch('/api/group',
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
              credentials:'include'
          });
          let data2 = await resp2.json();
          for(let i=0; i<data2.data.length; i++)
          if(Cookies.get('id') === data2.data[i].master)
            this.gruppiMaster.push(data2.data[i]);
          else if(this.control(Cookies.get('id'), data2.data[i]))
            this.gruppiPlayer.push(data2.data[i]);

            for(let i=0; i<this.gruppiMaster.length; i++){
          let resp3 = await fetch('/api/user?id='+this.gruppiMaster[i].master,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
              credentials:'include',
            });
            if(resp3.status === 200 ){
              let data3 = await resp3.json();
              this.gruppiMasterMaster.push(data3.username);
            }
            this.gruppiMasterPlayer.push([]);
            for(let j=0; j<this.gruppiMaster[i].characters.length; j++){
              let resp4 = await fetch('/api/user?id='+this.gruppiMaster[i].characters[j].user,
              {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
              });
              if(resp4.status === 200 ){
                let data4 = await resp4.json();
                this.gruppiMasterPlayer[i].push(data4.username);
              }
            }
          }
          
          for(let i=0; i<this.gruppiPlayer.length; i++){
          let resp3 = await fetch('/api/user?id='+this.gruppiPlayer[i].master,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
              credentials:'include',
            });
            if(resp3.status === 200 ){
              let data3 = await resp3.json();
              this.gruppiPlayerMaster.push(data3.username);
            }
            this.gruppiPlayerPlayer.push([]);
            for(let j=0; j<this.gruppiPlayer[i].characters.length; j++){
              let resp4 = await fetch('/api/user?id='+this.gruppiPlayer[i].characters[j].user,
              {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
              });
              if(resp4.status === 200 ){
                let data4 = await resp4.json();
                this.gruppiPlayerPlayer[i].push(data4.username);
              }
            }
          }
        },


        cancellaGruppo(_id){
          if(confirm("Sei sicuro di voler cancellare il gruppo? La scelta è irreversibile!"))
            {fetch('/api/group',
        {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify({id: _id})
        })
        .then((resp) => {
          if(resp.status === 204){
            resp.json(),
            this.visualizzaGruppi()}
          else{
            alert('ERROR, il gruppo non è stato cancellato')
          }})}
        },

        find(user_id){
          fetch('/api/user?id='+user_id,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'
            },
            credentials:'include',
        })
        .then((resp) => {
          if(resp.status === 200 ){
            resp.json()
            .then((data)=> {this.tmp = data.username})}
        })
        },

        control(id, data){
          let a=false;

          data.characters.forEach(element => {
              if(id === element.user ){
                a=true;
              }            
          });

          data.requests.forEach(element => {
              if(id === element.user ){
                a=true;
              }            
          });

          return a;
        },

        async richiesta(group, request){
          let resp3 = await fetch('/api/user?id='+request.user,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
              credentials:'include',
            });
            if(resp3.status === 200 ){
              let data3 = await resp3.json();
              this.richiestaNome = data3.username;
            }
          if(confirm("Vuoi accettare il seguente player nel gruppo? Utente: "+ this.richiestaNome)){
            fetch('/api/group/accept',{
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({id: group._id, user: request.user, character: request.character, request: request._id})
            })
              .then((resp)=>{
                if(resp.status === 200)
                  alert('aggiunto');
                  this.visualizzaGruppi();
              })
          }
          else{
            fetch('/api/group/decline',{
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({id: this.gruppiMaster[i]._id, request: this.gruppiMaster[i].requests[j]._id})
            })
              .then((resp)=>{
                if(resp.status === 200)
                  alert('rifiutato');
                  this.visualizzaGruppi();
              })
          }
        },

        async removePlayer(group, player){
          let resp3 = await fetch('/api/user?id='+player.user,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
              credentials:'include',
            });
            if(resp3.status === 200 ){
              let data3 = await resp3.json();
              this.richiestaNome = data3.username;
            }
          if(confirm("Vuoi davvero rimuovere il giocatore " + this.richiestaNome + " dal gruppo" + group.name +"?")){

          fetch('/api/group/remove',{
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({id: group._id, playerid: player._id})
          })
              .then((resp)=>{
                  if(resp.status === 200)
                      alert('giocatore rimosso');
                      this.visualizzaGruppi();
              })
          }
        }

    },
    mounted(){
        this.visualizzaGruppi();
    }
  }
</script>

<template>
  <main>
        <div class="wrapper">
            <nav>    

                <RouterLink to="/gruppi/crea">Crea</RouterLink>
                <RouterLink to="/gruppi/cerca">Cerca</RouterLink>
                <RouterLink to="/gruppi/mostraTutti">Mostra Tutti</RouterLink>
                <RouterLink to="/gruppi/mostraMiei" @click="visualizzaGruppi">Gruppi Personali</RouterLink>

            </nav>  
        </div>
        <div class="sottotitolo">GRUPPI COME MASTER (premere su mostra gruppi per mostrare i nomi)</div>
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
              <th>Cancella</th>
           </tr>
          </thead>
        <tbody>
          <tr v-for="item in gruppiMaster" :key="item._id">
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.code }}</td>
            <td>{{ gruppiMasterMaster[ gruppiMaster.indexOf(item)] }}</td>
            <td v-for="player in item.characters" @click="removePlayer(item, player)"> {{gruppiMasterPlayer[gruppiMaster.indexOf(item)][item.characters.indexOf(player)]}} </td>
            <td v-for="request in item.requests"><Button class="cancella" @click="richiesta(item, request)">Richiesta</Button></td>
            <td v-for="(value, index) in 5 - (item.characters.length + item.requests.length)"> X </td>
            <button @click="cancellaGruppo(item._id)" class="delete"> X </button>
          </tr>
        </tbody>
        </table>

    <div class="sottotitolo">GRUPPI COME PLAYER (premere su mostra gruppi per mostrare i nomi)</div>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in gruppiPlayer" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.code }}</td>
          <td>{{ gruppiPlayerMaster[ gruppiPlayer.indexOf(item)] }}</td>
          <td v-for="player in item.characters" > {{gruppiPlayerPlayer[gruppiPlayer.indexOf(item)][item.characters.indexOf(player)]}} </td>
          <td v-for="request in item.requests">Richiesta inviata</td>
          <td v-for="(value, index) in 5 - (item.characters.length + item.requests.length)"> X </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
  .cancella{
        width: 100%;
        width: 100%;
        border-radius: 0px;
        background-color: transparent;
  }
 .sottotitolo {
        margin-bottom: 20px;
        margin-top: 40px ;
 }

 .delete {
        background-color: transparent;
        width: 100%;
        width: 100%;
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
  
