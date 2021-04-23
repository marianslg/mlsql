export const options =
    [
        {
            "name": "Ordenar por más vendidos",
            "query": "SELECT * FROM Items ORDER BY sold_quantity DESC"
        },
        {
            "name": "Del vendedor con más transacciones, obtener el item con menor precio",
            "query": "SELECT * FROM Items ORDER BY sold_quantity DESC"
        }
    ];