'use strict';

const os = require('os'),
      bytes = require('bytes'),
      fetchTorrents = require('./src/torrents'),
      sendEmail = require('./src/email');

require('dotenv').config();

fetchTorrents().then((torrents) => {
  if (!torrents.length) {
    return;
  }

  sendEmail('torrents', { os, process, torrents, bytes });
});
