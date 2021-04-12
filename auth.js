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

