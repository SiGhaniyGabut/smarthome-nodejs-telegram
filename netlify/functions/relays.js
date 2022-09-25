const { app } = require('../../config/firebase');

exports.handler = async(req, next) => {
    const db = app.firestore();
    const docRef = db.collection('relays')
    const snapshot = await docRef.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(snapshot.docs.map(doc => doc.data()))
    }
}