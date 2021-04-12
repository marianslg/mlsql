import { test_token, refresh_token } from "./modules/meli/meli.js";

/*
algoritm:

if (localStorage has 'acc_token')
    if test_token()
        go to search.html
    else if localStorage has 'ref_token'
        if refresh_token()
            save acc_token
            go to search.html
        else
            continue
    else
        cointinue

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
var ref_token = localStorage.getItem('ref_token');
var acc_token = localStorage.getItem('acc_token');

console.log(ref_token)
console.log(acc_token)

var loc = "";

if (acc_token != null) {
    if (await test_token()) {
        // window.location.href = "search.html";
        loc = "search.html";
    } else if (ref_token != null) {
        let result_refresh = await refresh_token();

        if (result_refresh.status == 200) {
            localStorage.setItem("acc_token", result_refresh.access_token);
            loc = "search.html";

            //   window.location.href = "search.html";
        }
    }
}

if (urlParams.has('code')) {
    let code = urlParams.get('code')

    let json = await generate_token(code);

    if (json.refresh_token != undefined && json.access_token != undefined) {
        localStorage.setItem("ref_token", json.refresh_token);
        localStorage.setItem("acc_token", json.access_token);

        loc = "search.html";
        //   window.location.href = "search.html";
    } else {
        alert("Error en autenticación: \n" + json.message);
    }
}

document.getElementById("but-ir").addEventListener('click', ir);

function ir() {
    if (loc != "") {
        window.location.href = loc;
    } else {
        window.location.href = "auth.html" + (urlParams.get('code') != null ? "?code=" + urlParams.get('code') : "");
    }
}
