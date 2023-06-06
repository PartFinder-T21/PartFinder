TO START THE SITE:

NEL CASO SI VOLESSE MODIFICARE IL SITO IN LOCALE BISOGNA MODIFICARE TUTTI I "https://partfindert21web.onrender.com" CON "http://localhost:8080" ALL'INTERNO DELLE FETCH DI: 

-./static/App.vue

-./static/components/GroupsComponents/CreateGroup.vue

-./static/components/GroupsComponents/FindGroup.vue

-./static/components/GroupsComponents/MyGroups.vue

-./static/components/GroupsComponents/ShowAllGroups.vue

-./static/components/CharactersComponents/CreateCharacter.vue

./static/components/CharactersComponents/MyCharacters.vue




SERVER:
-OPEN CMD
    -GO TO PARTFINDER FOLDER
    -WRITE "npm install dotenv"
    -ADD THE ".env" file into a folder named "misc"
    -WRITE "node index.js"

CLIENT:
-OPEN CMD
    -GO TO PARTFINDER/STATIC FOLDER
    -WRITE "npm install"
    -WRITE "npm run dev"
    -OPEN THE BROWSER AND SEARCH FOR THE SITE WRITTEN IN THE CMD
