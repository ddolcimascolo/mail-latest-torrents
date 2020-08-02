'use strict';

const axios = require('axios'),
      _ = require('lodash'),
      os = require('os'),
      fs = require('fs').promises;

module.exports = function fetchTorrents() {
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
    .then(torrentsObjectToArray)
    .then(sortTorrentsByAddtime)
    .then(keepNewTorrents);
};

//

function torrentsObjectToArray(torrents) {
  return _.reduce(torrents, (accumulator, torrent, hash) => {
    accumulator.push([...torrent, hash]);

    return accumulator;
  }, []);
}

function sortTorrentsByAddtime(torrents) {
  return _.orderBy(torrents, getAddtime, ['desc']);
}

function getAddtime(torrent) {
  return torrent[torrent.length - 2]; // Last item is the hash, just before we have the custom "addtime"
}

function getHash(torrent) {
  return torrent[torrent.length - 1];
}

async function keepNewTorrents(torrents) {
  const newTorrents = [],
        hash = await readLastHash(),
        limit = process.env.RUTORRENT_LIMIT || 10;

  for (const torrent of torrents) {
    if (getHash(torrent) === hash || newTorrents.length === limit) {
      break;
    }

    newTorrents.push(torrent);
  }

  // Update hash if there are new torrents
  if (newTorrents.length > 0) {
    await writeLastHash(getHash(newTorrents[0]));
  }

  return newTorrents;
}

function readLastHash() {
  return fs.readFile(markerFile(), { encoding: 'utf-8' }).catch(() => '');
}

function writeLastHash(hash) {
  return fs.writeFile(markerFile(), hash, { encoding: 'utf-8' });
}

function markerFile() {
  return process.env.MARKER_FILE || `/tmp/mlt-${os.userInfo().username}`;
}
