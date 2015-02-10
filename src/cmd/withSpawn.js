'use strict';

var cocktail = require('cocktail');
var spawn    = require('child_process').spawn;

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@requires': [
        'getArgs'
    ],

    runSpawn: function (which, args) {
        this._attachSpawnListeners(spawn(which, args));
    },

    _attachSpawnListeners: function (spawnInstance) {
        var me = this;
        me._attachEventListener('data', spawnInstance.stdout, me._onProgress);
        me._attachEventListener('error', spawnInstance.stderr, me._onError);
    },

   _attachEventListener: function (event, stream, mthd) {
        stream.on(event, mthd.bind(this));
    },

    _onProgress: function (data) {
        console.log('' + data);
    },

    _onError: function (data) {
        console.error('Error: ' + data);
    }
});
