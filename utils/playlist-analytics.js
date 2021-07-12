"use strict";

const playlistAnalytics = {
  getShortestSong(playlist) {
    let shortestSong = null;
    if (playlist.songs.length > 0) {
      shortestSong = playlist.songs[0];
      for (let i = 1; i < playlist.songs.length; i++) {
        shortestSong = playlist.songs[i];
      }
    }
    return shortestSong;
  }
};

module.exports = playlistAnalytics;
