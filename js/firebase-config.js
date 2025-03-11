// firebase-config.js

// Substitua os placeholders abaixo com as credenciais do seu projeto Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Cria as instâncias para autenticação e Firestore
const auth = firebase.auth();
const db = firebase.firestore();
