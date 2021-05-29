const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/admin.reports.audit.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.error('Error loading client secret file', err);

  // Authorize a client with the loaded credentials, then call the
  // Reports API.
  authorize(JSON.parse(content), listLoginEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oauth2Client = new google.auth.OAuth2(
      "905932822288-blu64bm3dqbocv9p6mvprl3a223aq632.apps.googleusercontent.com", "wlHm5W8ntHYHPJptQFunGGxW", "https://meet.google.com/");

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oauth2Client, callback);
    oauth2Client.credentials = JSON.parse(token);
    callback(oauth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

/**
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

let participant=Object();
let seance=Object();
let participants=[];
let seances=[];
let participant_trouve=false;
let seance_trouve=false;
function listLoginEvents(auth) {
  const service = google.admin({version: 'reports_v1', auth});
  service.activities.list({
    userKey: 'all',
    applicationName: 'meet',
    eventName: "call_ended"
    
  }, (err, res) => {
    if (err) return console.error('The API returned an error:', err.message);

    const activities = res.data.items;
    if (activities.length) {
      console.log('Liste des activites:');
      activities.forEach((activity) => {
        let event=activity.events[0];
        seance.partage_ecran=0;
        participant.nbConnection=0;
        for (let index = 0; index < event.parameters.length; index++) {
          if (event.parameters[index].name==='conference_id') {
            seance.id=event.parameters[index].value;
            participant.conference=event.parameters[index].value;
            
          }
          if (event.parameters[index].name==='calendar_event_id') {
            seance.date=event.parameters[index].value;
          }
          if (event.parameters[index].name==='video_send_seconds') {
            seance.partage_ecran=parseInt(event.parameters[index].intValue);
          }
          if (event.parameters[index].name==='endpoint_id') {
            participant.IdConnection=event.parameters[index].value;
          }
          if (event.parameters[index].name==='duration_seconds') {
            participant.moyPresence=parseInt(event.parameters[index].intValue);
          }
          if (event.parameters[index].name==='device_type') {
            participant.typeTerminal=event.parameters[index].value;
          }
          if (event.parameters[index].name==='identifier') {
            participant.email=event.parameters[index].value;
            

          }
          if (event.parameters[index].name==='identifier') {
            participant.email=event.parameters[index].value;
          }
          if (event.parameters[index].name==='location_region') {
            participant.region=event.parameters[index].value;
          }
          
        }

        for (let i = 0; i < participants.length; i++) {
            if (participants[i].conference===participant.conference && participants[i].email===participant.email) {
              participant_trouve=true;
              participants[i].nbConnection++;
              participants[i].date+=participant.date;
            }          
        }
        for (let j = 0; j < seances.length; j++) {
            if (seances[j].id===seance.id) {
              seance_trouve=true;
              seances[j].partage_ecran+=seance.partage_ecran;
            }          
        }
        if (!participant_trouve) {
          ajoutParticipant(participant.conference,participant.IdConnection,participant.nbConnection,participant.moyPresence,participant.typeTerminal,participant.email,participant.region)
        }
        if (!seance_trouve) {
          ajoutSeance(seance.id,seance.date,seance.partage_ecran)
        }
        participant_trouve=false;
        seance_trouve=false;

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asphalt287@gmail.com',
    pass: 'aidara647'
  }
});

//MESSAGERIE POUR ENVOYER LE FORMULAIRE
        
        
 
var mailOptions = {
  from: 'asphalt287@gmail.com',
  to: participant.email,
  subject: 'FORMULAIRE EVALUATION DE LA SEANCE',
  text: 'https://fr.surveymonkey.com/r/95LKSWH'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  
        
      });
      console.log(participants);
      console.table(seance);
    } else {
      console.log('pas dactivites');
    }
  });
  const express = require('express');
  var app=express();
  app.use(express.json);
  app.listen(3000 ,()=>{
      console.log('Express est actif sur le port:',3000 );
  });

  
 //INSERTION DES DONNEES RECUPERER DANS LA BASE DE DONNEES 
const mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user :'professeur',
    password:'passer',
    database:'projet_schema'
});

  
  //ROUTAGE
app.get("/api/seances", (req, res) => {
  let sql = "select * from seance";
  db.query(sql, (err, result) => {
    if (err) {
      console.log("la requéte ne marche pas ");
      throw errr;
    }
    res.header("Access-Control-Allow-Origin", "*"),
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      ),
      res.status(200).send(result);
  });
});

app.post("/listepresence.html", (req, res) => {
  var sql2 ='INSERT INTO seance(Id_Conference,Date,Partage_ecran) VALUES (?,?,?)';
  db.query(sql2,['Azy3','dateAujourdhquiee',87], (err, result2) => {
    if (err) throw err;

    res.status(200).send(result2);
  });
});

}
function ajoutParticipant(conference,IdConnection,nbConnection,moyPresence,typeTerminal,email,region) {
  participants.push({conference,IdConnection,nbConnection,moyPresence,typeTerminal,email,region})
}
function ajoutSeance(id,date,partage_ecran) {
  seances.push({id,date,partage_ecran})
}
module.exports={
  SCOPES,
  listLoginEvents,
  authorize,
  db,
  participants,
  seances
};




