import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBUHM5DZZRid5pqhG4Eb5FloArQJoKmJQ8",
    authDomain: "scenes-6aefc.firebaseapp.com",
    projectId: "scenes-6aefc",
    storageBucket: "scenes-6aefc.appspot.com",
    messagingSenderId: "827245962532",
    appId: "1:827245962532:web:f25f1173a8d72663c03fb1",
    measurementId: "G-6QWQ5PVYTS"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);



export default app;