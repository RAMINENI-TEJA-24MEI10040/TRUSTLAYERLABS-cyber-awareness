import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:123"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);