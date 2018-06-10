import ParseConfig from "./parsecfg";

const SERVER_URL = "https://agiledirtybit.herokuapp.com";
const EMAIL_ENDPOINT = `${SERVER_URL}/email`;
const PARSE_SERVER = `${SERVER_URL}/parse`;
const RESET_EMAIL_ENDPOINT = `${PARSE_SERVER}/requestPasswordReset`;

//Returns a promise
//email - email to send signup email to
//username - username of person whose email to send to
export function sendSignupEmail(username, email) {
    return fetch(EMAIL_ENDPOINT, {
        body: JSON.stringify({
            user: { username: username },
            recipients: [email],
            type: "signup"
        }),
        headers: {
            "content-type": "application/json"
        },
        method: "POST"
    });
}

export function sendResetPasswordEmail(email) {
    return fetch(RESET_EMAIL_ENDPOINT, {
        body: JSON.stringify({
            email: email
        }),
        headers: {
            "content-type": "application/json",
            "X-Parse-Application-Id": ParseConfig.APP_ID,
            "X-Parse-REST-API-Key": ParseConfig.MASTER_KEY
        },
        method: "POST"
    });
}

//emails - Array of string emails
//subject - string
//message - string
//Returns a promise not converted to json
export function sendGenericEmail(subject, message, emails) {
    return fetch(EMAIL_ENDPOINT, {
        body: JSON.stringify({
            subject: subject,
            message: message,
            recipients: emails
        }),
        headers: {
            "content-type": "application/json"
        },
        method: "POST"
    });
}

// {
// "subject": "some subject",
//  "message": "Here is some message",
//  "recipients": ["edcarril@ucsd.edu", "mohaztec13@gmail.com"],
//  "type":"signup",
//  "user": {
//  	"username": "Eduardo Carrillo"
//  }
// }
