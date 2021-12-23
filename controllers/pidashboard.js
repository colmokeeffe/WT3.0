"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const stationStore = require("../models/station-store.js");
const stationCollection = require('../models/station-store.js');
const analytics = require("../utils/analytics.js");
const uuid = require("uuid");
const axios = require("axios");

const dashboard = {
  index(request, response) {
    logger.info("pi dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const userStations = stationStore.getUserStations(loggedInUser.id);
    userStations.sort((a, b) => (a.name > b.name) ? 1 : -1);
    for (let i = 0; i < userStations.length; i++) {
      analytics.calculations(userStations[i]);
    }
    const viewData = {
      title: "Station Dashboard",
      stations: userStations,
    };
    logger.info("about to render", stationStore.getAllStations());
    response.render("pi", viewData);
  },


  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      name: request.body.name,

    };
    logger.debug("Creating a new Station", newStation);
    stationStore.addStation(newStation);
    response.redirect('/pi');
  }
};

module.exports = dashboard;
