import firebase from "firebase";

const firebaseApp = firebase.initializeApp( {

    apiKey: "AIzaSyDuQh3BHDmZwh2TI_Y7bTvhbEv_hFB1XwE",
    authDomain: "instagram-clone-react-57c55.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-57c55.firebaseio.com",
    projectId: "instagram-clone-react-57c55",
    storageBucket: "instagram-clone-react-57c55.appspot.com",
    messagingSenderId: "346617291774",
    appId: "1:346617291774:web:b7d27f04a858940269d6af",
    measurementId: "G-Z0QRKVD4GG" 

  });

  
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};