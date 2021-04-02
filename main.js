import { ml_search, ml_search_all } from "./modules/meli/search_functions.js";
import * as db from "./modules/db/db.js";
import * as meli from "./modules/meli/meli.js"
import * as configs from "./modules/configs.js"
const delay_pre_search_item = 400;
var total_result_pre_search = 0;

init();

function init() {
    let result = db.create_tables();

    if (result[0])
        console.log("Se ha creado la base de datos correctamente.")
    else
        console.error("ERROR al crear la Base de Datos: " + result[1])
}

document.getElementById("button-search").addEventListener("click", search_all_items);
document.getElementById("search-value").addEventListener('keyup', apply_delay(pre_search_item, delay_pre_search_item));
document.getElementById("button-execute-query").addEventListener('click', execute_query);

async function pre_search_item() {
    let input = document.getElementById('search-value').value;
    let first_search_result = await ml_search(input);
    total_result_pre_search = first_search_result[1].paging.total;
    document.getElementById('text-pre-search').innerHTML = total_result_pre_search + " items encontrados aprox."
}

function apply_delay(callback, ms) {
    let timer = 0;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(this);
        }, ms || 0);
    };
}

function execute_query() {
    let txtarea = document.getElementById("textarea-query");
    let start = txtarea.selectionStart;
    let finish = txtarea.selectionEnd;

    let query = (start != finish) ? txtarea.value.substring(start, finish) : txtarea.value;

    let result_query = db.execute_query(query);
    console.log(result_query[1])

    let cant_rows = 0;
    let result_status = document.getElementById("result-status");
    
    document.getElementById("result-content").innerHTML = "";

    if (result_query[0]) {
        cant_rows = result_query[1].length;

        if (cant_rows > 0) createTable(result_query[1]);

        result_status.innerHTML = "OK";
    }
    else {
        result_status.innerHTML = "ERROR";
        console.log("ERROR: " + result_query[1]);
    }

    document.getElementById("result-stats").innerHTML = cant_rows + " rows."
}

function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    var row = document.createElement('tr');

    let aaa = Object.getOwnPropertyNames(tableData[0])
    console.log("aaa")
    console.log(aaa)

    var cell = document.createElement('th');
    cell.appendChild(document.createTextNode(""));
    row.appendChild(cell);

    aaa.forEach(function (cellData) {
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
    });

    tableBody.appendChild(row);
    tableData.forEach(function (rowData, index, array) {
        var row = document.createElement('tr');

        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(index + 1));
        row.appendChild(cell);


        Object.values(rowData).forEach(function (cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.getElementById("result-content").prepend(table);
}



async function search_all_items() {
    document.getElementById('button-execute-query').disabled = true;
    const hora_inicio = new Date()

    let input = document.getElementById('search-value').value;

    let json_array = await meli.search_all_items(input, total_result_pre_search);
    console.log(json_array)
    const hora_fin = new Date()

    //console.log(hora_inicio.toJSON() + " - FIN")

    const diffDays = Math.ceil(Math.abs(hora_fin - hora_inicio) / 1000);
    console.log("Tiempo: " + diffDays + " " + Math.abs(hora_fin - hora_inicio))
    document.getElementById('button-execute-query').disabled = false;
    document.getElementById('textarea-query').value = "SELECT seller_id, count(seller_id) as 'Cantidad' FROM items GROUP BY seller_id HAVING Cantidad > 10 ORDER BY CANTIDAD DESC";
    document.getElementById('button-execute-query').disabled = false;
}