var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");

sendNotification = function (fcmToken, roomId, username) {
    const message = {
        data: { roomId, username },
        token: fcmToken
    };
    // Send a message to the device corresponding to the provided
    // registration token.
    return admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            return response;
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}
router.post('/', async function (req, res, next) {
    const response = await sendNotification(req.body['fcmToken'], req.body['roomId'], req.body['caller'])
    res.send(response);
});

module.exports = router;
