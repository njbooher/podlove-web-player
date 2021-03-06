'use strict';

var windowOrigin = require('./util').getWindowOrigin();

var log = require('./logging').getLogger('Embed');

// everything for an embedded player
var
  players = [],
  $body;

function postToOpener(obj) {
  log.debug('postToOpener', obj);
  window.parent.postMessage(obj, windowOrigin);
}

function messageListener (event) {
  
  if (event.originalEvent.origin !== windowOrigin) {
    return;
  }
  
  var orig = event.originalEvent;

  if (orig.data.action === 'pause') {
    players.forEach(function (player) {
      player.pause();
    });
  }
}

function waitForMetadata (callback) {
  function metaDataListener (event) {
    if (event.originalEvent.origin !== windowOrigin) {
      return;
    }
    var orig = event.originalEvent;
    if (orig.data.playerOptions) {
      callback(orig.data.playerOptions);
    }
  }
  $(window).on('message', metaDataListener);
}

/**
 * initialize embed functionality
 * @param {function} $ jQuery
 * @param {Array} playerList all playersin this window
 * @returns {void}
 */
function init($, playerList) {
  players = playerList;
  $body = $(document.body);
  $(window).on('message', messageListener);
}

module.exports = {
  postToOpener: postToOpener,
  waitForMetadata: waitForMetadata,
  init: init
};
