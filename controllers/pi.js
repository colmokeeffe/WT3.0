"use strict";
"use strict";

const accounts = require("./accounts.js");
const stationStore = require("../models/station-store.js");
const stationCollection = require('../models/station-store.js');
const analytics = require("../utils/analytics.js");
const uuid = require("uuid");
const axios = require("axios");
const logger = require("../utils/logger");

const pi = {
  index1 (request, response) {
    logger.info("pi rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const userStations = stationStore.getUserStations(loggedInUser.id);
    const viewData = {
      title: "WeatherTop 3.0",
      stations: userStations,
    };
    response.render("pi", viewData);
  },

  addCity(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newCity = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      name: request.body.name,

    };
    logger.debug("Creating a new City", newCity);
    stationStore.addCity(newCity);
    response.redirect('/pi');
  }
};

module.exports = pi;
