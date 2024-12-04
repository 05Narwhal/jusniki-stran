// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  firebaseApiKey, 
  firebaseDomain, 
  firebaseProjectID, 
  firebaseAppID, 
  firebaseMeasurementID, 
  firebaseMessagingSenderID, 
  firebaseStorageBucket 
} from "../../../env";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseDomain,
  projectId: firebaseProjectID,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderID,
  appId: firebaseAppID,
  measurementId: firebaseMeasurementID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {
  app,
  firestore
}