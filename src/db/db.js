import * as bd_builds from "./db_builds.js";

export const sql_client = new SQL.Database();

export function create_tables() {
    if (sql_client != undefined) {
        let query = bd_builds.build_query_create_table();

        try {
            sql_client.run(query);
        } catch (error) {
            console.log("ERROR create_tables: " + error);

            return [false, error]
        }

        return [true, null];
    }
    else { return [false, "SQL undefined"]; }
}

export function execute_query(query) {
    try {
        console.log(sql_client.exec(query));
        let result = [];

        var stmt = sql_client.prepare(query);

        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }

        return [true, result];
    } catch (error) {
        return [false, error];
    }
}


export function insert(query) {
    if (query != "") {
        try {
            sql_client.run(query);

            return [true, ""];
        } catch (ex) {
            return [false, { "function": "db.insert", "query": query, "error": ex }];
        }
    }
    else {
        return [false, { "function": "db.insert", "query": query, "error": "query is null" }];
    }
}

export { bd_builds };