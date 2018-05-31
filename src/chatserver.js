const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("pusher-chatkit-server");

const app = express();

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:dae44b3a-7d46-4d6b-8894-1302096c409d",
    key: "75abc6fe-28d5-488b-9104-b45873c863cf:s4hgU9MqAV2FyWNslm3EMGrSBGtiyf3l8r6cAvwAHdI="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/users", (req, res) => {
    const { username, firstName, lastName } = req.body;
    console.log(username);
    chatkit
        .createUser({
            // TODO: check if user exists
            id: username,
            name: firstName + " " + lastName
        })
        .then(() => res.sendStatus(201))
        .catch(error => {
            if (error.error === "services/chatkit/user_already_exists") {
                res.sendStatus(200);
            } else {
                res.status(error.status).json(error);
            }
        });
});

app.post("/createchannel", (req, res) => {
    const { creator, teamMembers, channelName, isPrivate } = req.body;
    console.log(`creating new group channel: ${channelName}`);

    chatkit
        .createRoom({
            creatorId: creator,
            name: channelName,
            isPrivate: isPrivate,
            userIds: teamMembers
        })
        .then(room => {
            console.log(room);
            return res.json(room);
        })
        .catch(error => res.status(error.status).json(error));
});

app.post("/authenticate", (req, res) => {
    const authData = chatkit.authenticate({ userId: req.query.user_id });
    res.status(authData.status).send(authData.body);
});

const PORT = 3001;
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Running on port ${PORT}`);
    }
});
