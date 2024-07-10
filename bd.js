import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBHjxaAEYe58WlMHdZ15yKC0hDAbi20V5E",
    authDomain: "arcanum-bd4b1.firebaseapp.com",
    projectId: "arcanum-bd4b1",
    storageBucket: "arcanum-bd4b1.appspot.com",
    messagingSenderId: "733942943679",
    appId: "1:733942943679:web:9a1d2950b0402834141b0a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc,getDocs, deleteDoc, doc };
