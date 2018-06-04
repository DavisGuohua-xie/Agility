

const SERVER_URL = "http://agiledirtybit.herokuapp.com"
const EMAIL_ENDPOINT = `${SERVER_URL}/email`



//Returns a promise
//email - email to send signup email to
//username - username of person whose email to send to
export function sendSignupEmail( username, email){
  return fetch(EMAIL_ENDPOINT, {
    body: JSON.stringify({
        user: {username: username},
        recipients:[email]
      }),
  headers: {
    'content-type':'application/json'
  },
  method: 'POST'

  })
}


//emails - Array of string emails
//subject - string
//message - string
//Returns a promise not converted to json
export function sendGenericEmail(subject, message, emails){

     return fetch(EMAIL_ENDPOINT,{
       body: JSON.stringify({
         subject: subject,
         message: message,
         recipients: emails,
       }),
       headers: {
         'content-type': 'application/json'
       },
       method: 'POST'
     })
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
