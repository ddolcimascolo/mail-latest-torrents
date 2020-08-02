'use strict';

const os = require('os'),
      bytes = require('bytes'),
      fetchTorrents = require('./src/torrents'),
      sendEmail = require('./src/email');

require('dotenv').config();

fetchTorrents(process.env.RUTORRENT_LIMIT || 10)
  .then(torrents => sendEmail('torrents', { os, process, torrents, bytes }));
