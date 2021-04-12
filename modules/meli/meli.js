import * as db from "../db/db.js";
import * as meli_builds from "./meli_builds.js"
import { LIMIT_SEACH_ITEMS } from "../configs.js"

export async function refresh_token(refresh_token) {
    const url = meli_builds.build_refresh_token(refresh_token);

    let repsonse = await fetch(url);

    let json = await repsonse.json();

    if (repsonse.status == 200)
        json.status = 200;

    return json;
};

export async function generate_token(code) {
    const url = meli_builds.build_generate_token(code);

    try {
        let repsonse = await fetch(url);

        let json = await repsonse.json();

        return json;
    } catch (ex) {
        return { error: ex, message: ex.message };
    }
};

function request_header_access_token() {
    let acc_token = localStorage.getItem('acc_token');

    return {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + (acc_token != null ? acc_token : ""),
        }
    };
}

export async function test_token() {
    let response = await fetch(meli_builds.build_test_token(), request_header_access_token());

    return response.status == 200;
};

export async function search(input) {
    let response, json, result;
    const url = meli_builds.build_search(input, 0);

    console.log(url);

    try {
        response = await fetch(url, request_header_access_token());

        console.log("search response");
        console.log(response);

        if (response.status == 200) {
            json = await response.json();

            result = [true, json];
        } else {
            result = [false, ""];
        }
    } catch (ex) {
        result = [false, ex];
    }

    return result;
}

export async function search_all_items(input, total) {
    let total_results_real = 0;
    let first_search_result = await search(input, 0);
    let total_results = first_search_result[1].paging.total;

    let search_promises = [], search_responses = [];

    console.log("total_results: " + total_results)

    for (let i = 0; i < total_results; i += LIMIT_SEACH_ITEMS) {
        const url = await meli_builds.build_search(input, i);

        search_promises.push(fetch(url, request_header_access_token()).then(response => response.json()))
    }
    console.log("ml_search_all")

    await Promise.all(search_promises).then(response => {
        response.forEach(function (value) {
            value.results.forEach(function (value_response) {
                let query_inserts = db.bd_builds.buil_query_insert_into(value_response)
                total_results_real++;
                if (query_inserts[0]) {
                    query_inserts[1].forEach(function (query) {
                        db.insert(query)
                    });
                } else {
                    console.error(query_inserts[1]);
                }
            });
        });
    }).catch(reason => {
        console.log("catch " + reason)
    });

    return total_results_real;
}