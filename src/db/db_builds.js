/*  
    TEXT	"TEXT"
    NUMERIC	"NUM"
    INTEGER	"INT"
    REAL	"REAL"
*/

var sellers_id = [];
var items_id = [];

export const tables_struct = {
    "sellers": {
        "id": "TEXT PRIMARY KEY",
        "permalink": "TEXT",
        "seller_reputation__transactions__total": "INT",
        "seller_reputation__transactions__canceled": "INT",
        "seller_reputation__transactions__ratings__negative": "REAL",
        "seller_reputation__transactions__ratings__positive": "REAL",
        "seller_reputation__transactions__ratings__neutral": "REAL",
        "seller_reputation__metrics__claims__rate": "REAL",
        "seller_reputation__metrics__claims__total": "INT",
        "seller_reputation__metrics__sales__rate": "REAL",
        "seller_reputation__metrics__sales__total": "INT",
        "seller_reputation__metrics__cancellations__rate": "REAL",
        "seller_reputation__metrics__cancellations__total": "INT",
    },
    "items": {
        "id": "TEXT PRIMARY KEY", // search
        "title": "TEXT", // search
        "seller_id": "TEXT", // search
        "category_id": "TEXT", // search
        "price": "REAL", // search
        "available_quantity": "INT", // search
        "sold_quantity": "INT", // search
        "permalink": "TEXT", // search
        "thumbnail": "TEXT", // search
        "FOREIGN KEY": "(seller_id) REFERENCES sellers (id)"
    }
}

export function build_query_create_table() {
    let query = "";

    for (let table of Object.entries(tables_struct)) {
        let fields_array = [];

        for (let table_fields of Object.entries(table[1])) {
            if (table_fields[0] != "FOREIGN KEY")
                fields_array.push("'" + table_fields[0] + "' " + table_fields[1])
            else
                fields_array.push(table_fields.join(" "))
        }

        query += "CREATE TABLE " + table[0] + " (" + fields_array.join(", ") + "); ";
    }
    
    return query;
}

export function buil_query_insert_into(obj) {
    try {
        let query = [];
        let values_insert = ""

        if (!sellers_id.includes(obj.seller.id)) {
            try {
                values_insert = obj.seller.id + ", '" + obj.seller.permalink + "'," +
                    obj.seller.seller_reputation.transactions.total + "," +
                    obj.seller.seller_reputation.transactions.canceled + "," +
                    obj.seller.seller_reputation.transactions.ratings.negative + "," +
                    obj.seller.seller_reputation.transactions.ratings.positive + "," +
                    obj.seller.seller_reputation.transactions.ratings.neutral + "," +
                    obj.seller.seller_reputation.metrics.claims.rate + "," +
                    obj.seller.seller_reputation.metrics.claims.total + "," +
                    obj.seller.seller_reputation.metrics.sales.rate + "," +
                    obj.seller.seller_reputation.metrics.sales.total + "," +
                    obj.seller.seller_reputation.metrics.cancellations.rate + "," +
                    obj.seller.seller_reputation.metrics.cancellations.total;
            } catch {
                values_insert = obj.seller.id + ", '" + obj.seller.permalink + "',"
                try { values_insert += obj.seller.seller_reputation.transactions.total + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.transactions.canceled + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.transactions.ratings.negative + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.transactions.ratings.positive + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.transactions.ratings.neutral + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.metrics.claims.rate + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.metrics.claims.total + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.metrics.sales.rate + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.metrics.sales.total + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.metrics.cancellations.rate + "," } catch { values_insert += "null," }
                try { values_insert += obj.seller.seller_reputation.metrics.cancellations.total } catch { values_insert += "null" }
            }

            values_insert = values_insert.replaceAll("undefined", "null")
            query.push(`INSERT INTO sellers VALUES (` + values_insert + `);`);
            sellers_id.push(obj.seller.id)
        }

        if (!items_id.includes(obj.id)) {
            values_insert = "'" + obj.id + "'," +
                "'" + obj.title.replaceAll("'", "º") + "'," +
                "'" + obj.seller.id + "'," +
                "'" + obj.category_id + "'," +
                obj.price + "," +
                obj.available_quantity + "," +
                obj.sold_quantity + "," +
                "'" + obj.permalink + "'," +
                "'" + obj.thumbnail + "'";

            values_insert = values_insert.replaceAll("undefined", "null")

            query.push(`INSERT INTO items VALUES (` + values_insert + `);`);
            items_id.push(obj.id)
        }

        return [true, query];
    } catch (exception) {
        console.log("ERRORRRRRRRRRRRRRRRRRRRR----------------------------------------------")
        console.log(exception)

        return [false, exception];;
    }
}