import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {HomeScreen} from "./src/Home"
import {ScannerScreen} from "./src/Scanner"
import {HistoriqueScreen} from "./src/Historique"
import {StatusBar,LogBox} from "react-native";
import { EventRegister } from 'react-native-event-listeners';
import { PayerScreen } from './src/Payer';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import {save,getValueFor} from "./src/Storage/SecureStorage";
import themeContext from './src/Style/themeContext';
import {theme} from "./src/Style/Theme"
const Stack = createNativeStackNavigator();

/**
 * Definition des routes et propagation des thèmes
 * @returns 
 */
export default function App() {
    const[mode, setMode]=useState(true);
    //écoute le changement de thème et sauvegarde dans secureStorage
    useEffect( ()=>{
        let eventListener = EventRegister.addEventListener("changeTheme", (data)=>{
            save("theme",String(data)).then(()=>setMode(data))
        });
        return ()=>{
            EventRegister.removeEventListener(eventListener);
        }
    },[mode])

    useEffect(()=>{
        getValueFor("theme").then((value)=>{
            setMode(value);
          })
      },[])
    return (
        <themeContext.Provider value={mode === true ? theme.dark : theme.light}>
            <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor={mode?'#00345c':"#2b63fc"}/>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} options={{
                        title: 'Panier',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: mode?'#00345c':"#2b63fc",
                        },
                        headerTintColor:  mode?"white":"black",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}></Stack.Screen>

                    <Stack.Screen name="Scanner" component={ScannerScreen} options={{
                        title: 'Ajouter un produit',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: mode?'#00345c':"#2b63fc",
                        },
                        headerTintColor: mode?"white":"black",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}></Stack.Screen>

                    <Stack.Screen name="Historique" component={HistoriqueScreen} options={{
                        title: 'Historique',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: mode?'#00345c':"#2b63fc",
                        },
                        headerTintColor: mode?"white":"black",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}></Stack.Screen>

                    <Stack.Screen name="Payer" component={PayerScreen} options={{
                        title: 'Paiement',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: mode?'#00345c':"#2b63fc",
                        },
                        headerTintColor: mode?"white":"black",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </themeContext.Provider>
    );
}