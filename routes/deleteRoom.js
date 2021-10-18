var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");

const deleteCallback = async (roomId) => {
    const firestore = admin.firestore()
    const roomsRef = firestore.collection('rooms')

    const roomDoc = roomsRef.doc(roomId);
    const room = await roomDoc.get()
    if (!room.exists) {
        return 404;
    }

    const callerIceCandidatesCollection = roomDoc.collection('callerIceCandidates')
    const callerIceCandidatesDocs = await callerIceCandidatesCollection.listDocuments();
    callerIceCandidatesDocs.forEach(async callerIceCandidatesDoc => {
        await callerIceCandidatesDoc.delete()
    })

    const recipientIceCandidatesCollection = roomDoc.collection('recipientIceCandidates')
    const recipientIceCandidatesDocs = await recipientIceCandidatesCollection.listDocuments();
    recipientIceCandidatesDocs.forEach(async recipientIceCandidatesDoc => {
        await recipientIceCandidatesDoc.delete()
    })

    await roomDoc.delete();
    return 200;
}

const deleteRoom = async (roomId) => {
    const TIMEOUT = 25;
    return await new Promise(resolve => setTimeout(() => { resolve(deleteCallback(roomId)) }, TIMEOUT * 1000));
}

router.delete('/', async function (req, res, next) {
    deleteRoom(req.body['roomId'])
    res.status(200).send()
});

module.exports = router;
