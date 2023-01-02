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
    if(regex.test(password)&&password===password2) {
        fetch('http://localhost:8080/user/register'
            , {
                method: 'POST'
                ,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, username: username, description: description, password: password}),
            }).then((resp) => resp.json());
    }else {
        console.log("La password non soddisfa i criteri richiesti:\n" +
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
    fetch('http://localhost:8080/user'
        , {
            method: 'PUT'
            ,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, description: description}),
        }).then((resp) => resp.json());
};


function newgroup() {//TO FINISH-------------------------------------------------------------------------------------
    var nome = document.getElementById("newgroupname").value;
    var description = document.getElementById("newgroupDescription").value;
    var size = document.getElementById("newgroupsize").value;
    if(!isNaN(parseFloat(size)) && isFinite(size)) {
        fetch('http://localhost:8080/group'
            , {
                method: 'POST'
                ,
                headers: {'Content-Type': 'application/json'},
                credentials:'include',
                body: JSON.stringify({name: nome, description: description, size: size}),
            }).then((resp) => resp.json());
    }else {
        console.log("Size deve essere un numero");
    }
};


function cercagruppo() {
    var code = document.getElementById("getgroupscode").value;
    fetch('http://localhost:8080/group?='+code
        , {
            method: 'GET'
            ,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { code: code} ),
        }).then((resp) => resp.json());
};


function visualizzatuttigruppi() {

    fetch('http://localhost:8080/group',{
        method: 'GET'
    })
        .then((resp) => resp.json())
        .then((data)=>{
            const table = document.createElement("table");

            const array=data.data;
            for (let i = 0; i < array.length; i++) {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");//code,master,name,description,size
                cell1.textContent = "Codice: "+array[i].code+"\n Nome gruppo: "+array[i].name+"\n Descrizione: "
                    +array[i].description+"\n Dimensione: "+array[i].size;
                row.appendChild(cell1);
                table.appendChild(row);
            }
            document.body.appendChild(table);
        });
};
function visualizzagruppi() {
    fetch('http://localhost:8080/group/:user?='+Cookies.get('id'),{
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',

        })
        .then((resp) => resp.json())
        .then((data)=>{
            const table = document.createElement("table");
            const array=data.data;
            for (let i = 0; i < array.length; i++) {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");
                cell1.textContent = "Codice: "+array[i].code+"\n Nome gruppo: "+array[i].name+"\n Descrizione: "
                    +array[i].description+"\n Dimensione: "+array[i].size;
                row.appendChild(cell1);
                table.appendChild(row);
            }
            document.body.appendChild(table);
        });
};

function editgruppi() {
    var description = document.getElementById("editgroupsdescription").value;
    var size = document.getElementById("editgroupssize").value;
    if(!isNaN(parseFloat(size)) && isFinite(size)) {
        fetch('http://localhost:8080/group'
            , {
                method: 'PUT'
                ,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({description: description, size: size}),
            }).then((resp) => resp.json());
    }else {
        console.log("Size deve essere un numero");
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

