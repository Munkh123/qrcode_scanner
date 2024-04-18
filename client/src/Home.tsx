
import React, { useContext, useEffect, useState} from "react";
import { Text, Pressable, View, ScrollView, Switch} from "react-native";
import {styles} from "./Style/Stylesheet";
import  {getAll,add, deleteItem,updateItem} from './Storage/Database';
import Item from "./Interfaces/Item";
import { Fontisto, FontAwesome5, FontAwesome, Ionicons ,MaterialIcons} from '@expo/vector-icons'; 
import { EventRegister } from "react-native-event-listeners";
import {getValueFor} from "./Storage/SecureStorage"
import themeContext from "./Style/themeContext";
import {getItems} from "./Storage/fastAPI"

    /**
     * Augmenter la quantité de l'item de 1
     * @param item 
     */
    const addAmount=async (item:Item)=>{
        const itemToUpdate = item;
        itemToUpdate.amount = item.amount+1;
        updateItem(itemToUpdate)
    }

    /**
     * Réduire la quantité de l'item de 1
     */
    const removeAmount=async (item:Item)=>{
        const itemToUpdate = item;
        if(item.amount>1){
            itemToUpdate.amount = item.amount-1;
            updateItem(itemToUpdate);
        }
    }

    /**
     * Afficher un item
     * @param param0 
     * @returns 
     */
    const Produit = ({item,index,setState,state, theme }) => {
      
        return(
            <View style={[styles.produitDetails,{backgroundColor:theme.itemBackgroundColor, borderColor:theme.itemBorderColor}]} key={item.id+index}>
            <View style={{ flex: 2, paddingLeft: 10 , paddingRight:"30%"}}>
                <Text style={[styles.produitTexts, {color:theme.color}]}>Nom: {item.name}</Text>
                <Text style={[styles.produitTexts, {color:theme.color}]}>Prix unit: {(item.price/100).toFixed(2)} €</Text>
                <View style={{ flexDirection:"row" }}>
                <Text style={[styles.produitTexts, {color:theme.color}]}>Quantité: </Text>
                    <Pressable onPress={()=>{removeAmount(item); setState(state+1)}}>
                        <Ionicons style={{marginLeft:10,  marginRight:10, color:theme.itemBorderColor}}  name="remove-circle-sharp" size={24} color="black"/>
                    </Pressable>
                    <Text style={[styles.produitTexts, {color:theme.color}]}>{item.amount}</Text>
                    <Pressable onPress={()=>{addAmount(item); setState(state+1)}}>
                        <Ionicons style={{marginLeft:10,  marginRight:10, color:theme.itemBorderColor}}  name="add-circle-sharp" size={24} color="black" />
                    </Pressable>   
                </View>
            </View>
            <Pressable style={styles.deleteItemById} onPress={()=>{deleteItem(item);setState(state+1)}}>
                <FontAwesome style={{color:theme.itemBorderColor}} name="trash-o" size={40}/>
            </Pressable>
            </View>
        )
    }

    /**
     * Vérifier si un produit existe dans le panier
     * @param arr recherche 
     * @param id 
     * @returns 
     */
    function isFound(arr:Item[],id:number){
        for(let obj of arr){
            if(obj.id == id)
            return obj.amount;
        }
        return 0;
    }


//Accueil(Panier)
function Home({navigation, route} : any) {
  const [items, setItems] = useState<any[]>([]);
  const [state, setState] = useState(0);
  const [mode, setMode] = useState(true);
  const [pay, setPay] = useState(true);
  const theme = useContext(themeContext);

  //On charge le panier et s'il y a des produits, on vérifie les prix depuis l'API et on met à jour le panier
  useEffect( ()=>{
    getAll().then((data)=>{//récupération des données SQLite
        getItems().then( (apiData)=>{//récupération des données FastAPI
            let tab:any[] =[];
            //on met à jour les prix
            for(let item of data){
                apiData.map((apiTempItem)=>{
                    if(apiTempItem.id === item.id){
                        const insertion = apiTempItem;
                        insertion.amount = item.amount;
                        //si prix incorrect on met à jour dans la BD
                        if(apiTempItem.price !== item.price){
                            updateItem(insertion)
                        }
                        tab.push(insertion)
                    }
                })
            }
            setItems(tab)
            if(tab.length>0){
              setPay(false);
              setState(1)
            }else
              setPay(true);
        })
    });
  },[state])

  //un item a été ajouté par l'utilisateur, on met à jour la BD et l'affichage de la page
  useEffect( ()=>{            
    if(route.params !== undefined && route.params!=="payé"){
      const amount = isFound(items, route.params.id);
      const item = {id:route.params.id, name: route.params.name, price:route.params.price, amount:amount+1} as Item;
      add(item)
      route.params = undefined
      setState(state+1)
    }
    if(route.params !== undefined && route.params==="payé")
      route.params = undefined
      setState(state+1)
  }, [route.params]);

  useEffect(()=>{
    getValueFor("theme").then((value)=>{
        setMode(value);
      })
  },[])

  return (
    <View style={[styles.containerHome,{backgroundColor:theme.background}]}>
        <View style={[styles.barreHaut, {backgroundColor:theme.switchBar}]}>
          <Text >CHANGER THEME </Text>
          <Switch value={mode} 
            trackColor={{false: '#767577', true: '#81b0ff'}}
            onValueChange={(value)=> {
              setMode(!mode);
              EventRegister.emit("changeTheme", !mode);
          }} />
        </View>
        <View style={styles.list}>
          <ScrollView >
            {items.map(function(item, index){
                return <Produit key={item.id} item={item} index={index} setState={setState} state={state} 
                  theme={theme}>
                </Produit>;
            })}
          </ScrollView>
        </View>
      <View style={styles.buttons}>
        <Pressable onPress={()=>{navigation.navigate('Scanner')}} style={[styles.buttonAdd,{backgroundColor:theme.buttonAdd, shadowColor:theme.shadowColor}]}>
          <View style={{ flexDirection:"row" }}>
            <Fontisto name="shopping-basket-add" size={24} style={[styles.icons,{color:theme.colorReverse}]}/>
            <Text style={[styles.buttonText, {color:theme.colorReverse}]}>Ajouter un produit</Text>
          </View>
        </Pressable>
        <View style={{ flexDirection:"row" }}>
          <Pressable onPress={()=>{navigation.navigate('Historique', state)}} style={[styles.buttonHistorique, {backgroundColor:"#ffffff",shadowColor:theme.shadowColor}]}>
            <View style={{ flexDirection:"row"}}>
                <FontAwesome5 name="list-alt" size={24} color="white" style={[styles.icons,{color:"black"}]}/>
                <Text style={[styles.buttonText, {color:"black"}]}>Historique</Text>
              </View>
          </Pressable>
          <Pressable disabled={pay} onPress={()=>navigation.navigate('Payer')} style={[styles.buttonPay, {backgroundColor:theme.buttonPay, shadowColor:theme.shadowColor}]}>
            <View style={{ flexDirection:"row" }}>
                <MaterialIcons name="payment" size={30} style={[styles.icons,{color:"white"}]}/>
                <Text style={[styles.buttonText, {color:"white"}]}>
                    Payer
                </Text>
            </View>
        </Pressable>
        </View>
      </View>
    </View>
  );
}

export const HomeScreen = Home
export {getItems};