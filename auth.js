import { test_token, refresh_token, generate_token } from "./modules/meli/meli.js";

/*
algoritm:

if (url params has 'code')
    if generate_token()
        save ref_token and acc_token
        go to search.html
    else
        continue
else
    continue    
*/

var urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('code')) {
    let code = urlParams.get('code')

    let json = await generate_token(code);

    if (json.refresh_token != undefined && json.access_token != undefined) {
        localStorage.setItem("ref_token", json.refresh_token);
        localStorage.setItem("acc_token", json.access_token);
    } else {
        alert("Error en autenticación: \n" + json.message);
    }
}

document.getElementById("but-auth").addEventListener('click', auth);
document.getElementById("but-borrar-acc").addEventListener('click', borraAcc);
document.getElementById("but-borrar-ref").addEventListener('click', borrarRef);
document.getElementById("but-mod-acc").addEventListener('click', modAcc);
document.getElementById("but-mod-ref").addEventListener('click', modRef);

function auth() {
    window.location.href = "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=879324550414154&redirect_uri=https://marianslg.github.io/mlsql/";
}


function borrarRef() {
    localStorage.removeItem("ref_token");
}

function borraAcc() {
    localStorage.removeItem("acc_token");
}

function modRef() {
    localStorage.setItem("ref_token", "json.refresh_token");
}

function modAcc() {
    localStorage.setItem("acc_token", "json.access_token");
}

