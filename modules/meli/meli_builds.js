import * as configs from "../configs.js"

const url_meli_api = "https://api.mercadolibre.com/";
const url_proxy_meli = "https://proxy-api-ml.herokuapp.com/";

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

export function build_refresh_token(refresh_token) {
    let url = new URL(url_proxy_meli + "refresh_token");

    let params = {
        "refresh_token": refresh_token
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return url;
}

export function build_generate_token(code) {
    let url = new URL(url_proxy_meli + "generate_token");

    let params = {
        "code": code
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return url;
}

export function build_test_token() {
    let url = new URL(url_meli_api + "users/me");

    return url;
}