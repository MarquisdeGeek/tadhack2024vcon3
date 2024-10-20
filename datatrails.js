const querystring = require('querystring');
const fetch = require('node-fetch');
const fs = require('fs');

const urlStub = `https://app.datatrails.ai/archivist`;

async function getToken(clientID, clientSecret) {
    // TODO: FInish this! It returns "statusCode: 404"
    // Compare: https://docs.datatrails.ai/developers/developer-patterns/getting-access-tokens-using-app-registrations/
    const query = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: clientID,
        client_secret: clientSecret
    });
    const url = `${urlStub}/iam/v1/appidp/token?${query}`;
    const response = await fetch(url, { 
        method: 'GET',
    });

    const tokenData = await response.json();
    return tokenData["access_token"];
}


async function uploadAsset(filepath) {
    const bearerToken = fs.readFileSync(process.env["API_DATA_TRAILS_BEARER_FILE_TOKEN"]).toString().trim();
    const response = await fetch(`${urlStub}/v2/assets`, {
        method: 'post',
        body: fs.createReadStream(filepath),
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

module.exports = {
    getToken,
    uploadAsset
};
