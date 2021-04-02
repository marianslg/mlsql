import * as configs from "../configs.js"
import * as secrets from "../../secrets.js"

const url_meli_api = "https://api.mercadolibre.com/";

export function build_search(input, offset) {
    let url = new URL(url_meli_api + "sites/" + configs.meli_site_id + "/search");

    const params = {
        "q": input,
        "search_type": "scan",
        "offset": offset
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return url;
}

export function build_refresh_token() {
    let url = new URL(url_meli_api + "oauth/token");

    let params = {
        "grant_type": "refresh_token",
        "client_id": secrets.client_id,
        "client_secret":secrets.client_secret,
        "refresh_token": secrets.refresh_token
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return url;
}