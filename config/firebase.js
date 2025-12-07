// import admin from "firebase-admin";
// import serviceAccount from "../coffeeshop-d92d4-firebase-adminsdk-fbsvc-83212fabea.json" assert { type: "json" };
//
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://coffeeshop-d92d4-default-rtdb.asia-southeast1.firebasedatabase.app"
// });
//
// export default admin;

const admin = require("firebase-admin");
const serviceAccount = require("/etc/secrets/coffeeshop-d92d4-firebase-adminsdk-fbsvc-64f8326fbe.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coffeeshop-d92d4-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;