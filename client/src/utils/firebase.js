import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCaDLFdcpGlTc3dh-LGXNoZOCqBhJiH5ps",
    authDomain: "iron-verbena-296309.firebaseapp.com",
    databaseURL: "https://iron-verbena-296309-default-rtdb.firebaseio.com",
    projectId: "iron-verbena-296309",
    storageBucket: "iron-verbena-296309.appspot.com",
    messagingSenderId: "405135783077",
    appId: "1:405135783077:web:34aea0b2067a5c5fd6494c"
};

const app = firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();

export default app;
