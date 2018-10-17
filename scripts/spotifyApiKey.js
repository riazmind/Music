/**
*This script is adapted from ng-book (https://www.ng-book.com/2).
*It requests a Spotify API key from https://api.spotify.com/v1.
*In order for the script to run, the app must be built using "npm serve".
 **/

var fetch = require('isomorphic-fetch');
var btoa = require('btoa');
//var path = require('path');
var fs = require('fs');

// Credentials for Spotify
const SPOTIFY_BASE_URI = 'https://api.spotify.com/v1';
const SPOTIFY_CLIENT_ID =
  ''; 
const SPOTIFY_CLIENT_SECRET =
  ''; 
const BASE_64_ENCODED_CLIENT_CREDENTIALS = btoa(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
);

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(
      `HTTP Error ${response.statusText}`
    );
    error.status = response.statusText;
    error.response = response;
    console.log('Error communicating with Spotify:');
    console.log(error);
    throw error;
  }
}

function parseJson(response) {
  return response.json();
}

const SpotifyClient = {
  getApiToken() {
    return fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${BASE_64_ENCODED_CLIENT_CREDENTIALS}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(checkStatus)
      .then(parseJson)
      .then(json => json.access_token)
      .then(token => (this.token = token));
  }
};

console.log('Fetching Spotify API token...');
SpotifyClient.getApiToken().then(function(token) {
  let text = `export const SpotifyAPIKey = '${token}';\n`;
  let outputFile = 'src/environments/spotifyApiKey.ts';
  fs.writeFile(outputFile, text, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log(`saved to ${outputFile}`);
  });
});
