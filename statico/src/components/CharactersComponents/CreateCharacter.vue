<script>
    export default{
    data() {
      return {
        name: "",
        classe: "",
        forz: "",
        dex: "",
        int: "",
        cha: "",
      };
    },
    methods: {
      async inviaPg() {
            var stats=[forz, dex, int, cha]
        fetch('http://localhost:8080/character',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
                body: JSON.stringify({name: name, class: classe, stats: stats}),
            })
            .then((resp) =>
            {
                resp.json();
                if(resp.status === 201)
                    alert('Character created');
            });
      }
    }
}
</script>

<template>
    <h1>CREA PERSONAGGIO</h1>
    <form @submit.prevent="inviaPg">
            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text" id="name" v-model="name" required />
            </div>
            <div class="form-group">
              <label for="class">Classe</label>
              <input type="text" id="classe" v-model="classe" required />
            </div>
            <div class="form-group">
              <label for="for">For</label>
              <input type="text" id="forz" v-model="forz" required />
            </div>
            <div class="form-group">
              <label for="dex">Dex</label>
              <input type="text" id="dex" v-model="dex" required />
            </div>
            <div class="form-group">
              <label for="int">Int</label>
              <input type="text" id="int" v-model="int" required />
            </div>
            <div class="form-group">
              <label for="cha">Cha</label>
              <input type="text" id="cha" v-model="cha" required />
            </div>
          <button type="submit">Crea</button>
        </form>
</template>