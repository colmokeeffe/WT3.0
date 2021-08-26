"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store.js");
const analytics = require("../utils/analytics.js");
const uuid = require("uuid");



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