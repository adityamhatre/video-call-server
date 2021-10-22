var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");

const createDummyRoom = async (roomId) => {
    console.log("Creating dummy room: " + roomId);
    const firestore = admin.firestore()
    const roomsRef = firestore.collection('rooms')
    roomsRef.doc(roomId).set({ dummy: true });
}
const deleteCallback = async (roomId) => {
    console.log("Deleting room: " + roomId);
    const firestore = admin.firestore()
    const roomsRef = firestore.collection('rooms')

    const roomDoc = roomsRef.doc(roomId);
    const room = await roomDoc.get()
    if (!room.exists) {
        console.log("Room does not exist: " + roomId);
        createDummyRoom(roomId);
    }

    console.log("Deleting room: " + roomId + " which exists");
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
    console.log("Deleted room: " + roomId);
    return 200;
}

const deleteRoom = async (roomId) => {
    const TIMEOUT = 25;
    console.log("Scheduled deleting room: " + roomId);
    return await new Promise(resolve => setTimeout(() => { resolve(deleteCallback(roomId)) }, TIMEOUT * 1000));
}

router.delete('/', async function (req, res, next) {
    deleteRoom(req.body['roomId'])
    res.status(200).send()
});

module.exports = router;
