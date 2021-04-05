'use strict';

const axios = require('axios'),
      _ = require('lodash');

module.exports = function fetchTorrents(dateOfLatestKnownTorrent) {
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
      password: process.env.RUTORRENT_PASSWORD
    }
  })
    .then(res => res.data.t)
    .then(torrents => _.map(torrents, props => ({ date: +_.last(props), name: props[4], size: +props[5], user: props[14] })))
    .then(torrents => _.orderBy(torrents, 'date', ['desc'])) // Last item is the custom "addtime"
    .then(torrents => torrents.filter(({ date }) => date > dateOfLatestKnownTorrent));
};
