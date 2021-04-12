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
*/

var ref_token = localStorage.getItem('ref_token');
var acc_token = localStorage.getItem('acc_token');

if (acc_token != null) {
    if (await test_token()) {
        window.location.href = "search.html";
    } else if (ref_token != null) {
        let result_refresh = await refresh_token();

        if (result_refresh.status == 200) {
            localStorage.setItem("acc_token", result_refresh.access_token);
            window.location.href = "search.html";
        }
    }
}

window.location.href = "auth.html";