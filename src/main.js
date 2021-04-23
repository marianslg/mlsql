import * as db from "./db/db.js";
import * as meli from "./meli/meli.js"
import * as options from "./options.js"

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
document.getElementById("input-search-value").addEventListener('keyup', apply_delay(pre_search_item, delay_pre_search_item));
document.getElementById("button-execute-query").addEventListener('click', execute_query);
document.getElementById("actions").addEventListener('change', add_query);

set_selects();

async function pre_search_item() {
    let input = document.getElementById('input-search-value').value;
    let first_search_result = await meli.search(input);
    total_result_pre_search = first_search_result[1].paging.total;
    document.getElementById('info-search').innerHTML = "aprox. <b>" + total_result_pre_search + "</b> items encontrados."
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

    // document.getElementById("result-content").innerHTML = "";
    document.getElementById("result-text").innerHTML = "";

    if (result_query[0]) {
        document.getElementById("result-text").style.color = 'black';

        cant_rows = result_query[1].length;

        if (cant_rows > 0) {
            createTable(result_query[1]);
        }
        else {
            document.getElementById("result-text").innerHTML = "La consulta no devolvió resultados.";
        }

        result_status.innerHTML = "OK";
    }
    else {
        document.getElementById("result-text").style.color = 'red';
        document.getElementById("result-text").innerHTML = result_query[1];
        result_status.innerHTML = "ERROR";
        console.log("ERROR: " + result_query[1]);
    }

    document.getElementById("result-stats").innerHTML = cant_rows + " rows"
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
    document.getElementById("result-text").prepend(table);
}

async function search_all_items() {
    //Limpio las tablas
    db.execute_query("DELETE FROM sellers; DELETE FROM Items;");

    document.getElementById('info-search').innerHTML = "Buscando..."
    document.getElementById('button-search').disabled = true;
    document.getElementById('input-search-value').disabled = true;

    const hora_inicio = new Date()

    let input = document.getElementById('input-search-value').value;

    let total_results_real = await meli.search_all_items(input, total_result_pre_search);

    const hora_fin = new Date()

    //console.log(hora_inicio.toJSON() + " - FIN")

    const diffDays = Math.ceil(Math.abs(hora_fin - hora_inicio) / 1000);
    console.log("Tiempo: " + diffDays + " " + Math.abs(hora_fin - hora_inicio))

    document.getElementById('info-search').innerHTML = "<b>" + total_results_real + "</b> items encontrados"
    document.getElementById('button-execute-query').disabled = false;
    //document.getElementById('textarea-query').value = "SELECT seller_id, count(seller_id) as 'Cantidad' FROM items GROUP BY seller_id HAVING Cantidad > 10 ORDER BY CANTIDAD DESC";
    document.getElementById('button-execute-query').disabled = false;
    document.getElementById('actions').disabled = false;
    document.getElementById('button-search').disabled = false;
    document.getElementById('input-search-value').disabled = false;
}

function set_selects() {
    let actions = document.getElementById("actions");

    let option = document.createElement("option");

    option.text = "Acciones";
    option.hidden = true;

    actions.add(option);

    for (let op of options.options) {
        let option = document.createElement("option");

        option.text = op.name;
        option.value = op.query;

        actions.add(option);
    }
}

function add_query() {
    var e = document.getElementById("actions");

    document.getElementById('textarea-query').value += "\n" + e.value
}
