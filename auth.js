document.getElementById("but-auth").addEventListener('click', auth);

function auth() {
    window.location.href = "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=879324550414154&redirect_uri=https://marianslg.github.io/mlsql/";
}