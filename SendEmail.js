const myRequest = new XMLHttpRequest();



var API_USERNAME = 'a2659f20a805f6794f7604eb5d578ea1'
var API_PASSWORD = 'e762b238339f73c13e3f837ed0bb75a4'

var encodedAuth = 'Basic ' + btoa(API_USERNAME + ':' + API_PASSWORD)



const myurl = 'https://api.mailjet.com/v3/send'


const mydata = {}

mydata['FromEmail'] = 'edcarril@ucsd.edu'
mydata['FromName'] = 'EddieMoney'
mydata['Subject'] = '[BIG_DADDY]'
mydata['Text-part'] = 'Mailed from the app'
mydata['Recipients'] =  [{
  Email: 'edcarril@ucsd.edu'
}]


const mydataString = JSON.stringify(mydata)

myRequest.responseType = 'json'


myRequest.onreadystatechnage = function(){
  if (myRequest.readyState == XMLHttpRequest.DONE){
    console.log(myRequest.response)
  }


}


myRequest.withCredentials = true;


myRequest.open('POST', myurl)

myRequest.setRequestHeader('Authorization', encodedAuth)
myRequest.setRequestHeader('Content-Type', 'application/json')



myRequest.send(mydataString)
