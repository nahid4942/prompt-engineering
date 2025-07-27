// Your Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const storage = firebase.storage();
const firestore = firebase.firestore();

// Storage reference
const storageRef = storage.ref();

// Firestore collections
const ordersCollection = firestore.collection('orders');
const filesCollection = firestore.collection('files');

console.log('Firebase initialized successfully! 🔥');