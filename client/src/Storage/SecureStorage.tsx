import * as SecureStore from 'expo-secure-store';

/**
 * sauvegarde le thème
 * @param key 
 * @param value 
 */
async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

/**
 * récupère le thème(par défaut theme blanc)
 * @param key 
 * @returns 
 */
async function getValueFor(key):Promise<boolean>{
    let result = await SecureStore.getItemAsync(key);
    if(result)
        return result==="true"
    else
        return false
}

export {getValueFor, save};