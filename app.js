require('dotenv').config({ path: __dirname + '/.env' });
const express = require("express");
const https = require("https");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    console.log(fName, lName, email);

    const data = {
        "submittedAt": "15179271740034",
        "fields": [
            {
                "name": "email",
                "value": email
            },
            {
                "name": "firstname",
                "value": fName
            }
        ],
        "context": {
            "hutk": ':hutk', // include this parameter and set it to the hubspotutk cookie value to enable cookie tracking on your submission
            "pageUri": "www.example.com/page",
            "pageName": "Example page"
        },
        "legalConsentOptions": { // Include this object when GDPR options are enabled
            "consent": {
                "consentToProcess": true,
                "text": "I agree to allow Example Company to store and process my personal data.",
                "communications": [
                    {
                        "value": true,
                        "subscriptionTypeId": 999,
                        "text": "I agree to receive marketing communications from Example Company."
                    }
                ]
            }
        }
    }

    const portal = process.env.PORTAL;
    const form = process.env.FORM;

    const jsonData = JSON.stringify(data);
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${form}`;
    const options = {
        method: "POST",
        auth: process.env.KEY_API
    }
    const request = https.request(url, options, function (response) {
        res.sendFile(__dirname + "/success.html");
    })

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Port 3000");

});