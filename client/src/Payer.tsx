import { StripeProvider } from '@stripe/stripe-react-native';
import CheckoutScreen from './CheckoutScreen';
import Constants from 'expo-constants';
import { View, Text,FlatList} from "react-native";
import { useContext, useEffect , useState} from 'react';
import { getItems } from './Storage/fastAPI';
import { getAll, updateItem} from './Storage/Database';
import {styles} from "./Style/Stylesheet"
import themeContext from './Style/themeContext';

/**
 * Details du produit
 * @param param0 
 * @returns 
 */
const Item = ({item,theme})=>{
    return(
        <View style = {[styles.paiementItem,{borderWidth:1, borderColor:theme.itemBorderColor, backgroundColor:theme.itemBackgroundColor, borderRadius:10}]}>
            <Text style={{flex:1, fontSize:20, fontWeight:"bold", color:theme.color}}>{item.name}</Text> 
            <Text style={{flex:1, fontSize:20, color:theme.color}}>Quantité: {item.amount}</Text>
        </View>
    )
}

//Page paiement du panier
function Payer({navigation} : any) {
    const stripePK = Constants.expoConfig.extra.stripePK;
    const [items, setItems] = useState<any[]>([]);
    const [total, setTotal] = useState("");
    const theme = useContext(themeContext);

    useEffect(()=>{
        getAll().then((data)=>{//récupération des données SQLite
            getItems().then( (apiData)=>{//récupération des données FastAPI
                let tab:any[] =[];
                let somme = 0;
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
                            somme = somme + (apiTempItem.price*item.amount)
                        }
                    })
                }
                setTotal(somme.toString().slice(0, somme.toString().length-2) + "." + somme.toString().slice(somme.toString().length-2,somme.toString().length))
                setItems(tab)
            })
        });
    },[])

    return(
        <View style={{flex:1, flexDirection:"column", padding:7, backgroundColor:theme.background}}>
            <View style={{alignItems: 'center',justifyContent: 'center', borderWidth:1, paddingTop:10,paddingBottom:10, backgroundColor:theme.switchBar}}>            
                <Text style={[styles.textTotal,{color:theme.colorReverse}]}>Total: {total} €</Text>
            </View>
            <View style={styles.container}>
                <FlatList style={styles.paiementList}
                data={items}
                renderItem={({item}) =><Item item={item} theme={theme}/>}
                keyExtractor={item => item.id}
                />
            </View>
            <StripeProvider
                publishableKey={stripePK}
                merchantIdentifier="merchant.com.example">
                <CheckoutScreen navigation={navigation}/>
            </StripeProvider>
        </View>
    )
}

export const PayerScreen = Payer