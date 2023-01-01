var loggedUser = {}
function login() {loggedUser
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    fetch('localhost:8080/user/login'
        , {
            method: 'POST'
            ,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { email: email, password: password } ),
        }).then((resp) => resp.json())
        .then(function(data) {
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.id = data.id;
            loggedUser.self = data.self;
            document.getElementById("loggedUser").innerHTML = loggedUser.email;
            loadLendings();
            return;
        }).catch( error => console.error(error) );
};

function register() {
    var email = document.getElementById("registerEmail").value;
    var username = document.getElementById("registerUsername").value;
    var description = document.getElementById("registerDescription").value;
    var password = document.getElementById("registerPassword").value;
    var password2 = document.getElementById("registerPassword2").value;
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/;
    if(regex.test(password)&&password===password2) {
        fetch('localhost:8080/user/register'
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

function edit() {//TO DO -------------------------------------------------------------------------------------
    var username = document.getElementById("editUsername").value;
    var description = document.getElementById("editDescription").value;
    fetch('localhost:8080/user'
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
        fetch('localhost:8080/group'
            , {
                method: 'POST'
                ,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: nome, description: description, size: size}),
            }).then((resp) => resp.json());
    }else {
        console.log("Size deve essere un numero");
    }
};


function cercagruppo() {
    var code = document.getElementById("getgroupscode").value;
    fetch('localhost:8080/group'
        , {
            method: 'GET'
            ,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { code: code} ),
        }).then((resp) => resp.json());
};

function visualizzagruppi() {//TO FINISH------------------------------------------------------------------------------
    var code = document.getElementById("getgroupscode").value;
    fetch('localhost:8080/group/:user'
        , {
            method: 'GET'
            ,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { code: code} ),
        }).then((resp) => resp.json());
};

function editgruppi() {//TO DO------------------------------------------------------------------------------
    var description = document.getElementById("editgroupsdescription").value;
    var size = document.getElementById("editgroupssize").value;
    if(!isNaN(parseFloat(size)) && isFinite(size)) {
        fetch('localhost:8080/group'
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
    var stats=[];
    stats.push(stat1,stat2,stat3,stat4);
        fetch('localhost:8080/character'
            , {
                method: 'POST'
                ,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: name, class: classe, stats: stats,}),
            }).then((resp) => resp.json());
};
function visualizzapersonaggi() {//TO DO-----------------------------------------------------------------------
    stats.push(stat1,stat2,stat3,stat4);
    fetch('localhost:8080/character'
        , {
            method: 'GET'
            ,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, class: classe, stats: stats,}),
        }).then((resp) => resp.json());
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
    fetch('localhost:8080/character'
        , {
            method: 'PUT'
            ,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, class: classe, stats: stats,inventory: inventory}),
        }).then((resp) => resp.json());
};
