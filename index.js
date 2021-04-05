'use strict';

const _ = require('lodash'),
      os = require('os'),
      bytes = require('bytes'),
      { DateTime } = require('luxon'),
      fs = require('fs').promises,
      fetchTorrents = require('./src/torrents'),
      sendEmail = require('./src/email');

require('dotenv').config();

function loadState() {
  return fs.readFile(process.env.STATE_FILE, 'utf-8').catch(() => 0);
}

loadState()
  .then(state => fetchTorrents(state))
  .then(async(torrents) => {
    if (torrents.length) {
      await fs.writeFile(process.env.STATE_FILE, torrents[0].date);
      await sendEmail('torrents', { _, os, process, torrents, bytes, DateTime });
    }
  });
