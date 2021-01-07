import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDB4Jvu2uk4Zv6aFxU76HhIK8i6cSA3h1E",
    authDomain: "tenedores-8e7fc.firebaseapp.com",
    databaseURL: "https://tenedores-8e7fc.firebaseio.com",
    projectId: "tenedores-8e7fc",
    storageBucket: "tenedores-8e7fc.appspot.com",
    messagingSenderId: "139491960383",
    appId: "1:139491960383:web:314e5a18e8e3450def3a8a"
}

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);