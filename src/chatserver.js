const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("pusher-chatkit-server");

const app = express();

const chatkit = new Chatkit.default({
    instanceLocator: "v1:us1:dae44b3a-7d46-4d6b-8894-1302096c409d",
    key: "75abc6fe-28d5-488b-9104-b45873c863cf:s4hgU9MqAV2FyWNslm3EMGrSBGtiyf3l8r6cAvwAHdI="
});

const GOOD_STATUS = 201;
const OKAY_STATUS = 200;
const BAD_STATUS = 400;

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
        .then(() => res.sendStatus(GOOD_STATUS))
        .catch(error => {
            if (error.error === "services/chatkit/user_already_exists") {
                res.sendStatus(OKAY_STATUS);
            } else {
                res.status(BAD_STATUS).json(error);
            }
        });
});

app.post("/createusers", (req, res) => {
    const { project_members } = req.body;
    console.log(project_members);

    let formatted_members = [];
    project_members.forEach(user => {
        let { first_name, last_name, username, projectID } = user;
        formatted_members.push({
            id: username + projectID,
            name: first_name + " " + last_name
        });
    });

    chatkit
        .createUsers({ users: formatted_members })
        .then(response => {
            res.sendStatus(GOOD_STATUS);
            console.log("created all users on project");
        })
        .catch(err => {
            res.status(BAD_STATUS).json(error);
            console.log(err.error);
        });
});

app.post("/createchannel", (req, res) => {
    const { creator, teamMembers, channelName, isPrivate, idNameMap } = req.body;
    console.log(`creating new group channel: ${channelName}`);

    if (creator === "root") {
        chatkit
            .createRoom({
                creatorId: creator,
                name: channelName,
                isPrivate: isPrivate,
                userIds: teamMembers
            })
            .then(room => {
                console.log(room);
                return res.status(GOOD_STATUS).json(room);
            })
            .catch(error => {
                return res.status(BAD_STATUS).json(error);
            });
    } else {
        get_missing_users(teamMembers)
            .then(response => {
                console.log("get_missing_users");
                console.log(response);
                console.log(teamMembers);

                let missing = teamMembers.filter(member => {
                    let found = false;
                    response.forEach(responseUser => {
                        if (responseUser.id === member) {
                            found = true;
                        }
                    });
                    return !found;
                });

                console.log("missing");
                console.log(missing);

                let missingUsers = missing.map(m => {
                    return { id: m, name: idNameMap[m] };
                });

                console.log(idNameMap);

                return chatkit.createUsers({ users: missingUsers });
            })
            .then(response => {
                return chatkit.createRoom({
                    creatorId: creator,
                    name: channelName,
                    isPrivate: isPrivate,
                    userIds: teamMembers
                });
            })
            .then(room => {
                console.log(room);
                return res.status(GOOD_STATUS).json(room);
            })
            .catch(error => {
                return res.status(BAD_STATUS).json(error);
            });
    }
});

app.post("/authenticate", (req, res) => {
    const authData = chatkit.authenticate({ userId: req.query.user_id });
    res.status(authData.status).send(authData.body);
});

app.post("/getuser", (req, res) => {
    const { username } = req.body;
    console.log(username);

    chatkit
        .getUsersByIds({
            userIds: [username]
        })
        .then(response => {
            console.log(response);
            if (response.length > 0) return res.status(200).json({ exists: true });

            return res.status(200).json({ exists: false });
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json({ exists: false });
        });
});

let get_missing_users = function(members) {
    return chatkit.getUsersByIds({
        userIds: members
    });
};

const PORT = 3001;
app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Running on port ${PORT}`);
    }
});
