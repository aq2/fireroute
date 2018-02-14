import { initializeApp } from 'firebase'
let config = {
  apiKey: "AIzaSyBNYxHpiJt0U-h9Yb3E4MGXVCUBywtFpck",
  authDomain: "dvzvue.firebaseapp.com",
  databaseURL: "https://dvzvue.firebaseio.com",
  projectId: "dvzvue",
  storageBucket: "dvzvue.appspot.com",
  messagingSenderId: "804794548950"
}
const app = initializeApp(config)

export const db = app.database()
export const namesRef = db.ref('names')
export const datasetsRef = db.ref('datasets')