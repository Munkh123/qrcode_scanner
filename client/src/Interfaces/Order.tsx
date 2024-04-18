import Item from "./Item";
//Details d'une commande
interface Order{
    id: number,
    checkout_date: Date,
    items:Item[]
}

export default Order;