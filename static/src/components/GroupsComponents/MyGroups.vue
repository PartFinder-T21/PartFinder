<script>
  import Cookies from 'js-cookie'

    export default {
    data() {
      return {
        gruppiMaster: [],
        gruppiPlayer: [],
        tmp: ''
      }
    },
    methods: {
        visualizzaGruppi(){
            this.gruppiMaster=[];
            this.gruppiPlayer=[];
            
            fetch('/api/group/'+Cookies.get('id'),
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'
            },
            credentials:'include'
        })
        .then((resp) => resp.json())
        .then((data)=>{
            for(let i=0; i<data.data.length; i++){
                    if(Cookies.get('id') === data.data[i].master)
                      {this.gruppiMaster.push(data.data[i]);}
                    else
                    {this.gruppiPlayer.push(data.data[i])
                      this.find(this.gruppiPlayer[i].master)
                      this.gruppiPlayer[i].master = this.tmp
                      this.gruppiPlayer[i].characters.forEach(item => {
                        this.find(item)
                      item = this.tmp
                      })}
            }
        })
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

        controlla(obj){
          return (typeof obj !== 'undefined')
        },

        richiesta(i,j){
          if(confirm("Vuoi accettare il seguente player nel gruppo? Utente: "+this.find(this.gruppiMaster[i].requests[j].user))){
            fetch('/api/group/accept',{
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({id: this.gruppiMaster[i]._id, user: this.gruppiMaster[i].requests[j].user, character: this.gruppiMaster[i].requests[j].character, request: this.gruppiMaster[i].requests[j]._id})
            })
              .then((resp)=>{
                if(resp.status === 200)
                  alert('aggiunto');
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
            <td>{{ item.master }}</td>
            <td v-for="player in item.characters"> {{player.user}} </td>
            <td v-for="request in item.requests"><Button class="Delete" @click="richiesta(gruppiMaster.indexOf(item), item.request.indexOf(request))">Richiesta</Button></td>
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
          <td>{{ item.master }}</td>
          <td v-for="player in item.characters"> {{player}} </td>
          <td v-for="request in item.requests"><Button class="Delete" @click="richiesta">Richiesta</Button></td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
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
  