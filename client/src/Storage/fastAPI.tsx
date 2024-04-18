import Constants from 'expo-constants';
const userId = "cus_Ou2iBmfePpPrbH";
const apiUrl = Constants.expoConfig.extra.apiUrl;

    /**
     * Récupération des items disponibles
     * @returns 
     */
    const getItems = async () => {
        const reponse = await fetch(`${apiUrl}/items`)
            .then((resp) => {return resp.json()})
            .catch((error) => console.error(error))
        return reponse;
    };

    /**
     * récupération des paiements par id utilisateur
     * @returns 
     */
    const getPayments = async () => {
        const reponse = await fetch(`${apiUrl}/payments/${userId}?offset=0&limit=10`)
            .then((resp) => {return resp.json()})
            .catch((error) => console.error(error))

        return reponse;
    };

export {getItems,getPayments}