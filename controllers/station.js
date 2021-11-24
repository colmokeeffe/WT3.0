"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store.js");
const analytics = require("../utils/analytics.js");
const uuid = require("uuid");
const axios = require("axios");
const userstore = require("../models/user-store");



const station = {
  async index(request, response) {
    const stationId = request.params.id;
    logger.debug("Station id = " + stationId);
    const station = stationStore.getStation(stationId);
    analytics.calculations(station);

    const currentDate = new Date();
    const timestamp = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().replace ('T', ' ').replace('Z', '');

    const viewData = {
      title: 'Station',
      station: station,
      date: timestamp,
    };
    console.log(station);

    response.render('station', viewData);
  },

  addReading(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const currentDate = new Date();
    const timestamp = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().replace ('T', ' ').replace('Z', '');
    const newReading = {
      id: uuid.v1(),
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
      date: timestamp,
    };
    stationStore.addReading(stationId, newReading);
    response.redirect('/station/' + stationId);
  },

  async addreport(request, response){

    logger.info("rendering new report");
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const currentDate = new Date();
    const timestamp = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().replace ('T', ' ').replace('Z', '');

    let report = {};

    const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${station.lat}&lon=${station.lng}&units=metric&appid=7d57e4942506d7b5b48e58d69cfaae52`
    const result = await axios.get(oneCallRequest);

    if (result.status == 200) {
      console.log(result.data);
      const reading = result.data.current;
      report.id = uuid.v1();
      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
      report.date = timestamp;

      report.tempTrend = [];
      report.trendLabels = [];
      const trends = result.data.daily;
      for (let i=0; i<trends.length; i++) {
        report.tempTrend.push(trends[i].temp.day);
        const date = new Date(trends[i].dt * 1000);
        console.log(date);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}` );
      }
    }
    console.log(report);
    stationStore.addReading(stationId, report);
    response.redirect('/station/' + stationId);
  },



  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading 
    {{readingId}} from Station {{name}}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect('/station/' + stationId);
  },
};

module.exports = station;