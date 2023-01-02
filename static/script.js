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
    var credentials={
        email:email,
        username:username,
        password:password,
        description:description
    }
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/;
    if(regex.test(password)&&password===password2) {
        fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': 'true'
                },
                credentials:'include',
                body: JSON.stringify(credentials)
            })
            .then((resp) =>
            {
                if(resp.status === 201)
                    document.getElementById('loggedUser').innerHTML=Cookies.get('name')

            })
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

function edit() {//TO DO -------------------------------------------------------------------------------------
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
            console.log(data);
            console.log(data.data);
            const array = data.data;
            const table = document.getElementById("tabellagrouppi");

            for (let i = 0; i < array.length; i++) {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");//code,master,name,description,size
                cell1.textContent = array[i].code+"\n"+array[i].master+"\n"+array[i].name+"\n"
                    +array[i].description+"\n"+array[i].size;
                console.log(array[i]);
                row.appendChild(cell1);
                table.appendChild(row);
            }
        });
};
function visualizzagruppi() {
    fetch('http://localhost:8080/group',{
            method: 'GET'

        })
        .then((resp) => resp.json())
        .then((data)=>{
                const table = document.createElement("table");

                for (let i = 0; i < data.length; i++) {
                    if (Cookies.get('name') == data[i].master) {
                        const row = document.createElement("tr");
                        const cell1 = document.createElement("td");//code,master,name,description,size
                        cell1.textContent = data[i].code + "\n" + data[i].master + "\n" + data[i].name + "\n"
                            + data[i].description + "\n" + data[i].size;
                        row.appendChild(cell1);
                        table.appendChild(row);
                    }
                }
                document.body.appendChild(table);
            });
};

function editgruppi() {//TO DO------------------------------------------------------------------------------
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
            headers: {'Content-Type': 'application/json'},
            credentials:'include'
        })
        .then((resp) =>
        {
            resp.json()
        })
        .then((data)=>
        {

        })
};
function editcharacter() {
    var name = document.getElementById("editcharactername").value;
    var classe = document.getElementById("editcharacterclass").value;
    var stat1 = document.getElementById("editcharacterstat1").value;
    var stat2 = document.getElementById("editcharacterstat2").value;
    var stat3 = document.getElementById("editcharacterstat3").value;
    var stat4 = document.getElementById("editcharacterstat4").value;
    var inventory = document.getElementById("editcharacterinventory").value;
    var stats=[];
    stats.push(stat1,stat2,stat3,stat4);
    fetch('http://localhost:8080/character'
        , {
            method: 'PUT'
            ,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, class: classe, stats: stats,inventory: inventory}),
        }).then((resp) => resp.json());
};

