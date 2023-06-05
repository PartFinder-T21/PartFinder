<script>
    export default{
    data() {
      return {
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
      };
    },
    methods: {
      createCharacter() {
      fetch('/api/character',
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
                else
                    alert('ERROR, character not created')
            });
    }
    }
}
</script>

<template>
  <main>
    <nav>    

    <RouterLink to="/personaggi/crea">Crea</RouterLink>
    <RouterLink to="/personaggi/mostra">Mostra</RouterLink>

    </nav>
    <h1>CREA PERSONAGGIO</h1>
    <form @submit.prevent="createCharacter">
            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text" id="name" v-model="newCharacterData.name" required />
            </div>
            <div class="form-group">
              <label for="class">Classe</label>
              <input type="text" id="classe" v-model="newCharacterData.classe" required />
            </div>
            <div class="form-group">
              <label for="for">Forza</label>
              <input type="number" id="forz" v-model="newCharacterData.stats[0].value" required />
            </div>
            <div class="form-group">
              <label for="dex">Destrezza</label>
              <input type="numer" id="dex" v-model="newCharacterData.stats[1].value" required />
            </div>
            <div class="form-group">
              <label for="int">Intelligenza</label>
              <input type="number" id="int" v-model="newCharacterData.stats[2].value" required />
            </div>
            <div class="form-group">
              <label for="cha">Carisma</label>
              <input type="number" id="cha" v-model="newCharacterData.stats[3].value" required />
            </div>
          <button type="submit">Crea</button>
        </form>
      </main>
</template>


<style>
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