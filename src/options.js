export const options =
    [
        {
            "name": "Ordenar por más vendidos",
            "query": "SELECT * FROM Items ORDER BY sold_quantity DESC"
        },
        {
            "name": "Del vendedor con más transacciones, obtener el item con menor precio",
            "query": "SELECT * FROM Items WHERE seller_id = (SELECT id FROM Sellers ORDER BY seller_reputation__transactions__total DESC LIMIT 1) ORDER BY Price"
        }
    ];