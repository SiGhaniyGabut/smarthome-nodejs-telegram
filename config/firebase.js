const admin = require("firebase-admin");
const { serviceAccount } = require('./firebaseAdmin');

const app = !admin.apps.length ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
}) : admin.app();

module.exports = { app };