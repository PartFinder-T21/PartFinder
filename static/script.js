var loggedUser = {}
if(Cookies.get('name'))
    document.getElementById('loggedUser').innerHTML=Cookies.get('name')

function login() {loggedUser
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    let values={
        input:email,
        password:password
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
            document.getElementById('loggedUser').innerHTML=Cookies.get('name')
        })
};

function register() {
    var email = document.getElementById("registerEmail").value;
    var username = document.getElementById("registerUsername").value;
    var description = document.getElementById("registerDescription").value;
    var password = document.getElementById("registerPassword").value;
    var password2 = document.getElementById("registerPassword2").value;
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/;
    let send = {
        email:email,
        username:username,
        description:description,
        password:password
    }
    if(regex.test(password)&&password===password2) {
        fetch('http://localhost:8080/user/register'
            , {
                method: 'POST'
                ,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(send),
            })
            .then((resp) => {
                resp.json()
                if(resp.status === 201)
                    alert('utente registrato');
                else if(resp.status === 400)
                    alert('username o email non è univoco')
            });
    }else {
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
};

function edit() {
    var username = document.getElementById("editUsername").value;
    var description = document.getElementById("editDescription").value;
    var id = Cookies.get('id');
    let send={
        id:id,
        username:username,
        description:description
    }
    fetch('http://localhost:8080/user'
        , {
            method: 'PUT'
            ,
            headers: {'Content-Type': 'application/json','Access-Control-Allow-Credentials': 'true'},
            credentials:'include',
            body: JSON.stringify(send),
        })
        .then((resp) => {
            resp.json()
            if(resp.status === 200) {
                alert('account modificato');
                document.getElementById('loggedUser').innerHTML=Cookies.get('name')
            }
            else if(resp.status === 400)
                alert('username non è univoco')
        });
};


function newgroup() {//TO FINISH-------------------------------------------------------------------------------------
    var nome = document.getElementById("newgroupname").value;
    var description = document.getElementById("newgroupDescription").value;
    var size = document.getElementById("newgroupsize").value;
    if(!isNaN(parseFloat(size)) && isFinite(size) && size<=5 && size >=1) {
        fetch('http://localhost:8080/group'
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
};


function cercagruppo() {
    var code = document.getElementById("getgroupscode").value;
    fetch('http://localhost:8080/group?code='+code,
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
                        const resultSet=data.data
                        const table = document.getElementById('tabellaCerca');
                        table.innerHTML = "";
                        const row = document.createElement("tr");
                        const cell1 = document.createElement("td");
                        cell1.textContent = resultSet.name + "\n" + resultSet.code + "\n" + resultSet.description + "\n" + resultSet.size;
                        if (Cookies.get('id') && resultSet.master !== Cookies.get('id')) {
                            const button = document.createElement('button');
                            const select = document.createElement('select');
                            button.innerText = 'Join';
                            fetch('http://localhost:8080/character',
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
                                        const option = document.createElement('option');
                                        option.innerText = characters[j].name + ": " + characters[j].class;
                                        option.value = characters[j]._id;
                                        select.appendChild(option);
                                    }
                                    cell1.appendChild(select);
                                    button.onclick = () => {
                                        requestJoin(resultSet._id, select.value);
                                    }
                                    cell1.appendChild(button);
                                    row.appendChild(cell1);
                                    table.appendChild(row);
                                })
                        } else {
                            row.appendChild(cell1);
                            table.appendChild(row);
                        }

                    })
            }
        })
}

function visualizzatuttigruppi() {
    fetch('http://localhost:8080/group',
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'
            },
            credentials:'include'
        })
        .then((resp) => resp.json())
        .then((data)=>{
            console.log(data);
            let array = [];
            console.log(Cookies.get('id'))
            if(Cookies.get('id')){
                let resultSet = data.data;
                for(let i=0;i<resultSet.length;i++){
                    if(resultSet[i].master !== Cookies.get('id'))
                        array.push(resultSet[i]);
                }
            }
            else array = data.data;
            const table = document.getElementById('tabellagrouppi');
            table.innerHTML="";
            for (let i = 0; i < array.length; i++) {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");
                cell1.textContent = array[i].name+"\n"+array[i].code+"\n"+array[i].description+"\n"+array[i].size;
                if(Cookies.get('id')) {
                    const button = document.createElement('button');
                    const select = document.createElement('select');
                    button.innerText = 'Join';
                    fetch('http://localhost:8080/character',
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
                                const option = document.createElement('option');
                                option.innerText = characters[j].name + ": " + characters[j].class;
                                option.value = characters[j]._id;
                                select.appendChild(option);
                            }
                            cell1.appendChild(select);
                            button.onclick = () => {
                                requestJoin(array[i]._id, select.value);
                            }
                            cell1.appendChild(button);
                            row.appendChild(cell1);
                            table.appendChild(row);
                        })
                }
                else {
                    row.appendChild(cell1);
                    table.appendChild(row);
                }

            }
        });
};
function requestJoin(groupId,characterId){
    let send={
        character:characterId,
        id:groupId
    }
    fetch('http://localhost:8080/group/request',
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
}
function visualizzagruppi() {
    let id = Cookies.get('id');
    fetch('http://localhost:8080/group/'+Cookies.get('id'),{
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',

        })
        .then((resp) => resp.json())
        .then(async (data) => {
            const tableMaster = document.getElementById("gruppimaster");
            const tablePlayer = document.getElementById("gruppiplayer");
            const div = document.getElementById('mieigruppi');
            tableMaster.innerHTML = "";
            tablePlayer.innerHTML = "";
            const array = data.data;
            for (let i = 0; i < array.length; i++) {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");
                cell1.textContent = "Codice: " + array[i].code + "\n Nome gruppo: " + array[i].name + "\n Descrizione: "
                    + array[i].description + "\n Dimensione: " + array[i].size;
                if (array[i].master === id) {
                    const button = document.createElement('button');
                    const btnM = document.createElement('button');
                    button.innerText = 'Modifica';
                    button.onclick = () => {
                        document.getElementById('editgroupid').value = array[i]._id;
                        document.getElementById("editgroupsname").value = array[i].name;
                        document.getElementById("editgroupsdescription").value = array[i].description;
                        document.getElementById("editgroupssize").value = array[i].size;
                        document.getElementById('editgroupdiv').style.visibility = 'visible';
                    }
                    cell1.appendChild(button);

                    btnM.innerText = 'Elimina';
                    btnM.onclick = async () => {
                        const response = await fetch('http://localhost:8080/group', {
                            method:'DELETE',
                            headers: {'Content-Type': 'application/json'},
                            credentials: 'include',
                            body: JSON.stringify({id:array[i]._id})
                        })
                        if(response.status === 204)
                            alert('gruppo eliminato');
                    }
                    cell1.appendChild(btnM);


                    const players = array[i].characters;
                    for(let j=0; j<players.length;j++){
                        const el = document.createElement('li');
                        const btnA = document.createElement('button');
                        let user = await fetch('http://localhost:8080/user?id='+players[j].user,
                            {method: 'GET',
                                headers: {'Content-Type': 'application/json'},
                                credentials:'include'});
                        if(user.status === 404 || user.status === 500) break;
                        user = await user.json();
                        user = user.username;
                        console.log(user);
                        let character = await fetch('http://localhost:8080/character?id='+players[j].character,{
                            method: 'GET',
                            headers: {'Content-Type': 'application/json'},
                            credentials:'include',
                        });
                        if(character.status === 404 || character.status === 500) break;
                        character = await character.json();
                        character = character.data.class;
                        el.innerText = user+ ': '+character;
                        btnA.innerText = 'Rimuovi';
                        btnA.onclick=()=>{
                            remove(array[i]._id,players[i]._id);
                        }
                        cell1.appendChild(el);
                        cell1.appendChild(btnA);
                    }

                    const requests = array[i].requests;
                    for (let j = 0; j < requests.length; j++) {
                        const el = document.createElement('li');
                        const btnA = document.createElement('button');
                        const btnD = document.createElement('button');
                        let user = await fetch('http://localhost:8080/user?id='+requests[j].user,
                            {method: 'GET',
                            headers: {'Content-Type': 'application/json'},
                            credentials:'include'});
                        if(user.status === 404) break;
                        user = await user.json();
                        user = user.username;
                        console.log(user);
                        let character = await fetch('http://localhost:8080/character?id='+requests[j].character,{
                            method: 'GET',
                            headers: {'Content-Type': 'application/json'},
                            credentials:'include',
                        });
                        if(character.status === 404) break;
                        character = await character.json();
                        character = character.data.class;
                        el.innerText = user+ ': '+character;
                        btnA.innerText = 'Accetta';
                        btnD.innerText = 'Rifiuta';
                        btnA.onclick=()=>{
                            accept(array[i]._id,requests[j].user,requests[j].character,requests[j]._id);
                            visualizzagruppi();
                        }
                        btnD.onclick=()=>{
                            decline(array[i]._id,requests[j]._id);
                            visualizzagruppi();
                        }
                        cell1.appendChild(el);
                        cell1.appendChild(btnA);
                        cell1.appendChild(btnD);
                    }

                    row.appendChild(cell1);
                    tableMaster.appendChild(row);
                    console.log('preappend')

                }
                else {
                    console.log('append');
                    row.appendChild(cell1);
                    tablePlayer.appendChild(row);
                }
            }
            div.style.visibility = 'visible';
        });
};
function accept(id,user,character,request){
    let send={
        id:id,
        user:user,
        character:character,
        request:request
    }
    fetch('http://localhost:8080/group/accept',{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(send)
    })
    .then((resp)=>{
        if(resp.status === 200)
            alert('aggiunto');
    })
}
function decline(id,request){
    let send={
        id:id,
        request:request
    }
    fetch('http://localhost:8080/group/decline',{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(send)
    })
        .then((resp)=>{
            if(resp.status === 200)
                alert('rifiutato');
        })
}
function remove(id,player){
    let send={
        id:id,
        playerid:player
    }
    fetch('http://localhost:8080/group/remove',{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(send)
    })
        .then((resp)=>{
            if(resp.status === 200)
                alert('giocatore rimosso');
        })
}
function editgruppi(id) {
    var id = document.getElementById('editgroupid').value;
    var name = document.getElementById("editgroupsname").value;
    var description = document.getElementById("editgroupsdescription").value;
    var size = document.getElementById("editgroupssize").value;
    let send = {
        id:id,
        name:name,
        description:description,
        size:size
    };
    if(!isNaN(parseFloat(size)) && isFinite(size) && size>=1 && size <= 5) {
        fetch('http://localhost:8080/group'
            , {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(send),
            })
            .then((resp) => {
                resp.json()
                if(resp.status === 200){
                    alert('Gruppo modificato');
                    visualizzagruppi();
                }
            });
    }else {
        console.log("Size non valida");
        alert("Size non valida");
    }
};
function newcharacter() {
    var name = document.getElementById("newcharactername").value;
    var classe = document.getElementById("newcharacterclass").value;
    var stat1 = document.getElementById("newcharacterstat1").value;
    var stat2 = document.getElementById("newcharacterstat2").value;
    var stat3 = document.getElementById("newcharacterstat3").value;
    var stat4 = document.getElementById("newcharacterstat4").value;
    var stats=[{stat:"strength",value:stat1},{stat:"dexterity",value:stat2},{stat:"intelligence",value:stat3},{stat:"charisma",value:stat4}]
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
};
function visualizzapersonaggi() {//TO DO-----------------------------------------------------------------------
    fetch('http://localhost:8080/character',
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'
            },
            credentials:'include'
        })
        .then((resp) => resp.json())
        .then((data)=>{
            console.log(data);
            const array = data.data;
            let statarray = [];
            let inventory = [];
            const table = document.getElementById('tabellapersonaggi');
            table.innerHTML="";
            for (let i = 0; i < array.length; i++) {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");
                cell1.textContent = array[i].name+"\n"+array[i].class+"\n";
                for(let j=0;j<array[i].stats.length;j++){
                    const el = document.createElement("li");
                    el.innerText = array[i].stats[j].stat + ': ' + array[i].stats[j].value;
                    statarray.push(array[i].stats[j].value);
                    cell1.appendChild(el);
                }
                for(let j=0;j<array[i].inventory.length;j++){
                    const el = document.createElement("ul");
                    el.innerText = array[i].inventory[j]
                    inventory.push(array[i].inventory[j]);
                    cell1.appendChild(el);
                }
                const button = document.createElement('button');
                button.innerText = 'Modifica';
                button.onclick =()=>{
                    let div = document.getElementById('editcharacterformdiv');
                    let inventoryDiv = document.getElementById('editcharacterinventory');
                    document.getElementById('characterid').value = array[i]._id
                    document.getElementById("editcharactername").value = array[i].name;
                    document.getElementById('editcharacterclass').value = array[i].class;
                    document.getElementById("editcharacterstat1").value = statarray[0];
                    document.getElementById("editcharacterstat2").value = statarray[1];
                    document.getElementById("editcharacterstat3").value = statarray[2];
                    document.getElementById("editcharacterstat4").value = statarray[3];
                    for(let j=0;j<inventory.length;j++){
                        let input = document.createElement('input');
                        input.value = inventory[j];
                        inventoryDiv.appendChild(input);
                    }
                    let input = document.createElement('input');
                    inventoryDiv.appendChild(input);
                    console.log(document.getElementById('characterid').value);
                    div.style.visibility = "visible";
                }
                cell1.appendChild(button)
                row.appendChild(cell1);
                table.appendChild(row);
            }
        });
};
function editcharacter() {
    var id = document.getElementById('characterid').value;
    var name = document.getElementById("editcharactername").value;
    var classe = document.getElementById("editcharacterclass").value;
    var stat1 = document.getElementById("editcharacterstat1").value;
    var stat2 = document.getElementById("editcharacterstat2").value;
    var stat3 = document.getElementById("editcharacterstat3").value;
    var stat4 = document.getElementById("editcharacterstat4").value;
    var inventory = [];
    var childDivs = document.getElementById('editcharacterinventory').getElementsByTagName('input');
    for(let i=0; i< childDivs.length; i++ )
    {
        inventory.push(childDivs[i].value);
    }
    var stats=[{stat:"strength",value:stat1},{stat:"dexterity",value:stat2},{stat:"intelligence",value:stat3},{stat:"charisma",value:stat4}]
    let send;
    if(inventory !== [])
        send = {
            id:id,
            name:name,
            class:classe,
            stats:stats,
            inventory:inventory
        }
    else
        send = {
            id:id,
            name:name,
            class:classe,
            stats:stats,
        }
    fetch('http://localhost:8080/character',
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials:'include',
            body: JSON.stringify(send),
        })
        .then((resp) =>
        {
            resp.json();
            if(resp.status === 200)
                alert('Character modified');
            visualizzapersonaggi();

        });
};

