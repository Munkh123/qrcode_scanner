import { useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import React, { useEffect, useState, useContext } from "react";
import { Alert, Text, Pressable, View } from "react-native";
import {styles} from "./Style/Stylesheet";
import { MaterialIcons } from '@expo/vector-icons'; 
import  {getAll,deleteAll} from './Storage/Database';
import themeContext from './Style/themeContext';

/**
 * Bouton pour valider un paiement avec Stripe
 * @param param0 
 * @returns 
 */
export default function CheckoutScreen({navigation}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(true);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const apiUrl = Constants.expoConfig.extra.apiUrl;
    const theme = useContext(themeContext);
    const userId = "cus_Ou2iBmfePpPrbH";
    let itemsToPay:any[] = [];

    /**
     * Préparation des données
     * @returns 
     */
    const fetchPaymentSheetParams = async () => {
        await getAll().then((data)=>{
            data.forEach((element)=>{
                itemsToPay.push({id:element.id, amount:element.amount})
            })
        });

        const response = await fetch(`${apiUrl}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "pending_items": itemsToPay,
                "customer_id": userId,
            })
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    /**
     * Prépation de la feuille du paiement
     */
    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });

        if (!error) {
            setPaymentIntentId(paymentIntent);
            setLoading(true);
        }

    };

    /**
     * Ouverture de la feuille du paiement
     */
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
        } else {
            const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
            const response = await fetch(`${apiUrl}/payments/check/${paymentIntent}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "customer_id": userId
                })
            });
            
            //si paiement validé
            if (response.status == 200){
                await deleteAll().then(()=>{
                Alert.alert('Succes', 'Votre commande a été validé!');
                }).finally(()=>navigation.navigate('Home',"payé"))
            };
        }
        
    };

    //init la feuille de paiment
    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <Pressable disabled={!loading} onPress={openPaymentSheet} style={[styles.paiementButton,{backgroundColor:"#2962FF"}]}>
            <View style={{ flexDirection:"row"}}>
                <MaterialIcons name="payment" size={30} style={[styles.icons, {color:"black"}]}/>
                <Text style={[styles.buttonText,{color:"black"}]}>
                    Payer
                </Text>
            </View>
        </Pressable>
    );
}