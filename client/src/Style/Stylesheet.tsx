import {StyleSheet} from "react-native";

//Mise en forme des éléments
const stylesheet = StyleSheet.create({
    
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    containerHome: {
      flex: 1,
  },

    /*********************LIST DES PRODUITS*********************/
    barreHaut:{
      flex:0.5,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },

    list: {
      flex:5
    },

    buttons: {
      flex:1,
      padding:7,
      alignItems: 'center',
      justifyContent: 'center',
    },

    //Text des boutons
    buttonText: {
      fontWeight: 'bold',
      letterSpacing: 0.25,
      fontSize:18,
    },

    //Bouton ajouter un produit
    buttonAdd:{
      alignItems: 'center',
      justifyContent: 'center',
      width:"100%",
      padding: 7,
      borderRadius: 3,
      elevation: 3,
    },

    //Bouton historique
    buttonHistorique:{
      alignItems: 'center',
      justifyContent: 'center',
      width:"48%",
      padding: 7,
      marginTop:10,
      borderRadius: 3,
      marginRight:5,
      elevation: 3,
    },

    //Bouton Payer
    buttonPay:{
      alignItems: 'center',
      justifyContent: 'center',
      width:"48%",
      padding: 7,
      marginTop:10,
      marginLeft:5,
      borderRadius: 3,
      elevation: 3,
    },

    //icones
    icons:{
      marginRight:10,
    },

    /*********************PRODUIT DETAILS*********************/
    produitDetails:{
      marginTop:10,
      marginLeft:10,
      marginBottom:10,
      marginRight:10,
      paddingBottom:10,
      paddingTop:10,
      height:110,
      flexDirection:"row",
      borderWidth:3,
      borderRadius:20,
      justifyContent: 'center',
      alignItems: 'center',
      elevation:3,
    },

    produitTexts:{
      fontSize:17,
    },

    //Bouton Supprimer
    deleteItemById:{
      flex: 1, 
      paddingRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      width:"100%",
      height:"100%",
    },

    /**
     * HISTORIQUE
     */

    historiqueBody:{
      padding:2,
    },

    order:{
      width:"100%",
      borderWidth:3,
      marginTop:10,
      marginBottom:10,
      borderRadius:10,
    },

    titreHistoriqueItem: { 
      borderWidth:1,
      padding: 5,
      fontSize:17,
      fontWeight:"bold",
      borderRadius:10,
      marginVertical: 8, 
      marginHorizontal: 16, 
    },

    totalHistoriqueItem:{
      borderWidth:3,
      padding: 5,
      textAlign:"center",
      backgroundColor:"black",
      fontSize:17,
      fontWeight:"bold",
      color:"#03fc24",
      borderRadius:10,
      marginVertical: 8, 
      marginHorizontal: 16, 
    },

    produitDetailsHistorique:{
      flex: 1, 
      marginTop:10,
      marginLeft:10,
      marginBottom:10,
      marginRight:10,
      flexDirection:"row",
      borderWidth:1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:10,
      height:70,
      elevation:3,
    },

    produitTextsHistorique:{
      fontWeight:"bold",
      padding:10,
      fontSize:15,
    },

    /**
     * List ajout manuelle
     */
    listManuelle: { 
      padding: 2,
      elevation:3,
      marginBottom:80,
    },

    itemManuelle: {
      flexDirection:"row",
      padding: 20,
      borderWidth:1,
      marginVertical: 8, 
      marginHorizontal: 16, 
    },


    paiementList: {
      flex: 5
    },

    paiementItem: {
      flexDirection:"row",
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },

    textTotal:{
      fontSize:25,
      fontWeight:"bold"
    },

    paiementButton:{
      alignItems: 'center',
      justifyContent: 'center',
      height:40,
      padding: 7,
      marginTop:10,
      marginBottom:10,
      borderRadius: 1,
      elevation: 3,
    },
});

export const styles = stylesheet;