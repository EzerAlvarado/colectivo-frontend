import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.APIKEY_FIRE,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT,
  storageBucket: process.env.BUCKET,
  messagingSenderId: process.env.SENDER,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENT
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };



/*import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };*/