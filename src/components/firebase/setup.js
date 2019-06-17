import firebase from 'firebase';

var firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: "react-chat-app-c73b5.firebaseapp.com",
    databaseURL: "https://react-chat-app-c73b5.firebaseio.com",
    projectId: "react-chat-app-c73b5",
    storageBucket: "react-chat-app-c73b5.appspot.com",
    messagingSenderId: "796917658678",
    appId: "1:796917658678:web:7a56a3df70652934"
};

export default class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
      }
}