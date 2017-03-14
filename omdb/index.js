'use strict';

const request = require('request');
const createResponse = require('../utils');
const getInfo = data => {
  let intent = data.entities.intent && data.entities.intent[0].value || 'movieinfo';
  let movie = data.entities.movie && data.entities.movie[0].value || null;
  let yearofrelease = data.entities.yearofrelease && data.entities.yearofrelease[0].value || null;

  return new Promise((resolve, reject) => {
    if (movie) {
      //Get the movie information
      //resolve(`Finding details about ${movie}`);
      request({
        //http://www.omdbapi.com/?t=interstellar&plot=full&r=json
        uri: "http://www.omdbapi.com",
        qs: {
          t: movie,
          plot: 'full',
          y: yearofrelease,
          r:'json'
        },
        method: 'GET'
      }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
          let responseBody = JSON.parse(body);
          console.log(responseBody);
          resolve(createResponse(intent, JSON.parse(body)));
        } else {
          reject(error);
        }
      });
    } else {
      reject("Entities not present");
    }
  });

}

module.exports = getInfo;
