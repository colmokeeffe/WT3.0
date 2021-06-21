"use strict";

const logger = require("../utils/logger");
const playlistStore = require("../models/playlist-store");
const uuid = require("uuid");

const playlist = {
  index(request, response) {
    const playlistId = request.params.id;
    logger.debug("Playlist id = ", playlistId);
    const viewData = {
      title: "Playlist",
      playlist: playlistStore.getPlaylist(playlistId)
    };
    response.render("playlist", viewData);
  },

  deleteSong(request, response) {
    const playlistId = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song ${songId} from Playlist ${playlistId}`);
    playlistStore.removeSong(playlistId, songId);
    response.redirect("/playlist/" + playlistId);
  },

  addSong(request, response) {
    const playlistId = request.params.id;
    const playlist = playlistStore.getPlaylist(playlistId);
    const newSong = {
      id: uuid.v1(),
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration)
    };
    logger.debug("New Song = ", newSong);
    playlistStore.addSong(playlistId, newSong);
    response.redirect("/playlist/" + playlistId);
  }
};

module.exports = playlist;
