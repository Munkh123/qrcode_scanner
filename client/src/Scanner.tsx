import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SearchBar } from "react-native-elements"; 
import { BarCodeScanner } from 'expo-barcode-scanner';
import {styles} from "./Style/Stylesheet";
import Item from './Interfaces/Item';
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons'; 
import themeContext from './Style/themeContext';
import { getItems } from './Storage/fastAPI';

//Page ajout produit
function Scanner({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [state, setState] = useState<any>({data:[],searchValue:""});
    const [loading, setLoading] = useState<boolean>(true);
    const theme = useContext(themeContext);

    const apiUrl = Constants.expoConfig.extra.apiUrl;

    /**
     * Récupérer un item par id
     * @param itemId 
     * @returns 
     */
    const getItemById = async (itemId) => {
        const reponse = await fetch(`${apiUrl}/items/${itemId}`)
            .then((resp) => {return resp.json()})
            .catch((error) => console.error("Erret get item by ID : ",error))
        return reponse;
    }

    /**
     * Ajouter manuellement un item
     * @param item
     */
    const ajouterItem=async (item:Item)=>{
        const id = item.id;
        getItemById(id).then((verifiedItem)=>{
            if(verifiedItem.id !== undefined){
                const itemToAdd = item as Item;
                itemToAdd.amount=1;
                navigation.navigate('Home', itemToAdd);
            }else{
                setScanned(false);
                alert("le produit n'est pas disponible !")
            }
        })
    }

    /**
     * Description de l'item
     * @param param0 
     * @returns 
     */
    const ItemDetails = ({ item }) => {
        return ( 
        <View style={[styles.itemManuelle, {backgroundColor: theme.itemBackgroundColor, borderColor:theme.itemBorderColor}]}> 
            <Text style={{flex:1, marginRight:10, fontSize:18, fontWeight:"bold", color:theme.color}}>{item.name}</Text> 
            <Text style={{flex:1,fontSize:18, color:theme.color}}>prix: {(item.price/100).toFixed(2)} €</Text> 
            <Pressable style={{marginLeft:20}} onPress={()=>ajouterItem(item)}><Ionicons name="add-circle-outline" size={27} color={theme.color}/></Pressable>
        </View> 
        ); 
    };

    /**
     * afficher un item
     * @param param0 
     * @returns 
     */
    const renderItem = ({ item }) => <ItemDetails item={item as Item}/>;

    /**
     * demande de permission
     */
    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };


    /**
     * Un QRcode a été scanné
     * @param param0 
     */
    const handleBarCodeScanned = ({ type, data}) => {
        setScanned(true);
        try{
            const id = JSON.parse(data).id;
            getItemById(id).then((verifiedItem)=>{
                if(verifiedItem.id !== undefined){
                    const item = {...JSON.parse(data), amount:1} as Item;
                    navigation.navigate('Home', item);
                }else{
                    setScanned(false);
                    alert("le produit n'est pas disponible !")
                }
            })
        }catch(error){
            setScanned(false);
        }
    };


    /**
     * Chercher le nom du produit dans les produits
     * @param text
     */
    const searchFunction = (text) => {
        const updatedData = state.data.filter((item) => {
            const item_data = `${item.name.toUpperCase()})`; 
            const text_data = text.toUpperCase(); 
            return item_data.indexOf(text_data) > -1; 
        });
        setState({ data: updatedData, searchValue: text });
    };

    /**
     * demander la permission d'accès à la caméra
     */
    useEffect(() => {
        getBarCodeScannerPermissions();
    }, []);

    /**
     * Cas de refus d'accès à la caméra. l'utilisateur saisi
     */
    if (hasPermission === false || hasPermission === null) {
        if(loading){
            getItems().then((data)=>{setState({ data: data, searchValue:""});});
            setLoading(false);
        }
        return ( 
            <View style={[styles.listManuelle, {backgroundColor:theme.background}]}> 
                <SearchBar 
                    placeholder="Chercher produit..."
                    round
                    value={state.searchValue} 
                    onChangeText={(text) => {
                        if(text!=="")
                            searchFunction(text)
                        else
                            setLoading(true);
                    }} 
                    autoCorrect={false}
                    inputStyle={{backgroundColor:theme.color}}
                    inputContainerStyle={{backgroundColor:theme.color}}
                    containerStyle={{backgroundColor:theme.itemBackgroundColor, borderWidth:1}}
                /> 
                <FlatList 
                    data={state.data} 
                    renderItem={(item)=>renderItem(item)} 
                    keyExtractor={(item) => item.id} 
                /> 
            </View> 
            );
    }else{//caméra accepté
        return (
        <View style={styles.container}>
            <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            />
        </View>
        );
    }
}

export const ScannerScreen = Scanner