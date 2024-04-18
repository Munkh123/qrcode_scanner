# Barcode Scanner

## Technologies requises

Vous allez avoir besoin des technologies suivantes :
- [Android Studio](https://developer.android.com/studio "Android Studio") ainsi que la [JDK 20+](https://www.oracle.com/fr/java/technologies/downloads "JDK")
- [Docker](https://www.docker.com "Docker") Desktop ou CLI
- [NodeJS LTS](https://nodejs.org/fr "NodeJS")
- Un compte [Stripe](https://stripe.com/fr "Stripe")

Fonctionnalités :

- [x] Scan de codes-barres
    - [x] Accès au panier
    - [x] Si l'appareil photo n'est pas disponible, il faut pouvoir ajouter les articles manuellement
    - [x] Une vérification via l'API est nécessaire afin de savoir si l'article existe
- [x] Un panier
    - [x] Contient l'ensemble des articles scannés
    - [x] Accessible depuis la page de scan des articles
    - [x] Possibilité de retirer du panier un article scanné
    - [x] Lorsque qu'un article est ajouté plusieurs fois, afficher un indicateur précisant le nombre du même article
    - [x] Possibilité d'augmenter la quantité d'un article déjà scanné
    - [x] Possibilité de payer les articles sélectionnés à l'aide de Stripe
    - [x] Sauvergarde du panier pour de futurs achats
- [x] Un historique des articles payés
- [x] Un [thème jour/nuit](https://m2.material.io/design/color/dark-theme.html#ui-application)


Le projet est composé des choses suivantes :
- [Server](./server/README.md) : Une API développée avec FastAPI afin d'utiliser Stripe. Vous pouvez implémenter la votre
- [Client](./client/README.md) : Une application React Native de départ, c'est ici que vous allez développer l'application

***Il est important de configurer le serveur avant le client.***

## Informations

Le projet a été créé l'aide de la commande suivante :

```shell
npx create-expo-app -t expo-template-blank-typescript
```

Il est possible de lancer l'application dans un émulateur Android et/ou iOS :

```shell
npx expo run:android  # npx expo run:ios
```
