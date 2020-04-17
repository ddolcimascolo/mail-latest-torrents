'use strict';

const axios = require('axios'),
      _ = require('lodash');

module.exports = function fetchTorrents(limit) {
  function buildSearchParams() {
    const params = new URLSearchParams();

    params.append('mode', 'list');
    params.append('cmd', 'd.custom=addtime');

    return params;
  }

  return axios.get(`${process.env.RUTORRENT_URL}/plugins/httprpc/action.php`, {
    data: buildSearchParams(),
    auth: {
      username: process.env.RUTORRENT_USERNAME,
      password: process.env.RUTORRENT_PASSWORD,
    },
  })
    .then(_.property('data.t'))
    .then(_.values)
    .then((torrents) => _.sortBy(torrents, _.last)) // Last item is the custom "addtime"
    .then(_.reverse)
    .then((torrents) => _.slice(torrents, 0, limit));
};
