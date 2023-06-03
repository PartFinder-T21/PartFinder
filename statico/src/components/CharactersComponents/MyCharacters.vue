<script>
  export default {
    data() {
      return {
        personaggi: []
      }
    },
    methods: {
        visualizzaPgs(){
            fetch('/api/character',
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
        }
    },
    mounted(){
        this.visualizzaPgs();
    }
  }
</script>

<template>
    <main>
        <nav>    

          <RouterLink to="/personaggi/crea">Crea</RouterLink>
          <RouterLink to="/personaggi/mostra" @click="visualizzaPgs">Mostra</RouterLink>

         </nav>

        <div>
            <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Classe</th>
          <th>Forza</th>
          <th>Destrezza</th>
          <th>Intelligenza</th>
          <th>Carisma</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in personaggi" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ item.class }}</td>
          <td>{{ item.stats[0].value }}</td>
          <td>{{ item.stats[1].value }}</td>
          <td>{{ item.stats[2].value }}</td>
          <td>{{ item.stats[3].value }}</td>
        </tr>
      </tbody>
    </table>
        </div>
         
    </main>
</template>

<style>
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