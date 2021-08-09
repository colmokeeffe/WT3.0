"use strict";

const playlistAnalytics = {
  getShortestSong(playlist) {
    let shortestSong = null;
    if (playlist.songs.length > 0) {
      shortestSong = playlist.songs[0];
      for (let i = 1; i < playlist.songs.length; i++) {
        if (playlist.songs[i].duration < shortestSong.duration) {
          shortestSong = playlist.songs[i];
        }
      }
    }
    return shortestSong;
  },

  getPlaylistDuration(playlist) {
    let playlistDuration = 0;
    for (let i = 0; i < playlist.songs.length; i++) {
      let song = playlist.songs[i];
      playlistDuration = playlistDuration + song.duration;
    }
    return playlistDuration;
  }
};

module.exports = playlistAnalytics;
