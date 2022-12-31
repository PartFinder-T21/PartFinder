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
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,}$/;
    if(regex.test(password)) {
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
            "al meno un carattere speciale tra (@$!%*?&_)\n");
    }
};

function edit() {//TO
};


function newgroup() {//TO DO
    var nome = document.getElementById("newgroupname").value;
    var description = document.getElementById("newgroupDescription").value;
    var size = document.getElementById("newgroupsize").value;
    fetch('localhost:8080/group'
        , {
            method: 'POST'
            ,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { name: nome,description: description, size: size } ),
        }).then((resp) => resp.json());
};
