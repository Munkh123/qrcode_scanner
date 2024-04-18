import React, { useEffect, useState, useContext } from "react";
import { Text , View, ScrollView } from "react-native";
import {styles} from "./Style/Stylesheet";
import Item from "./Interfaces/Item";
import themeContext from "./Style/themeContext";
import { getPayments } from "./Storage/fastAPI";
import Order from "./Interfaces/Order";
/**
 * Description d'un produit
 * @param param0 
 * @returns 
 */
const Produit = ({item, theme})=>{
    return(
        <View style={[styles.produitDetailsHistorique, {backgroundColor:theme.itemBackgroundColor}]}>
          <Text style={[styles.produitTextsHistorique,{flex:1,color:theme.color}]}>{item.name}</Text>
          <Text style={[styles.produitTextsHistorique,{flex:2,color:theme.color}]}>Prix unit: {(item.price/100).toFixed(2)} €</Text>
          <Text style={[styles.produitTextsHistorique,{flex:2,color:theme.color}]}>Quantité: {item.amount}</Text>
        </View>
    );
}

/**
 * Description de la commande
 * @param param0 
 * @returns 
 */
const OrderComponent = ({order, index,theme}) => {
    let date = order.checkout_date.split("T");
    let somme=0;
    return(
        <View key={order.id+ index} style={[styles.order, {backgroundColor:theme.historiqueBackGround, borderColor:theme.itemBorderColor}]}>
            <Text style={[styles.titreHistoriqueItem,{color: "white",borderColor:theme.itemBorderColor,backgroundColor:"black"}]}>La commande de: {date[0]}</Text>
            {order.items.map(function(item:Item, index){
                somme= somme+ (item.price/100)*item.amount;
                return <Produit item={item} theme={theme} key={order.id + item.id+ index}></Produit>
            })}
            <Text style={[styles.totalHistoriqueItem,{borderColor:theme.itemBorderColor}]}>Total: {somme.toFixed(2)} €</Text>
        </View>
    )
}

/**
 * Page historique
 * @param param0 
 * @returns 
 */
function Historique({route}) {
    const[orders, setOrders]= useState<Order[]>([]);
    const theme = useContext(themeContext);

    //récupération des commandes validés
    useEffect(()=>{
        getPayments().then((orders)=>{
            let ordersNew:Order[] = [];
            //parcours des commandes
            orders.forEach(order => {
                let itemList:Item[] = [];
                //récupération des items dans la commande courante
                if(order.checkout_date!==null){
                    order.purchased_items.forEach(element => {
                        const quantity = element.amount;
                        itemList.push({...element.item, amount:quantity} as Item);
                    });
                    ordersNew.push({id:order.id, checkout_date:order.checkout_date, items:itemList} as Order);
                }
            });
            setOrders(ordersNew);            
        });
    },[route.params])

    return(
        <View style={[styles.historiqueBody,{backgroundColor:theme.background}]}>
            <ScrollView>
                {orders.map(function(item, index){
                    return <OrderComponent order={item} key={item.id} index={index} theme={theme}></OrderComponent>;
                })}
            </ScrollView>
        </View>
    );
}

export const HistoriqueScreen = Historique