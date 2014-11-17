'use strict';

var cocktail = require('cocktail');
var spawn    = require('child_process').spawn;

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@requires': [
        'resolveCmd',
        'getArgs'
    ],

    run: function () {
        var me = this,
            which = me.resolveCmd(),
            args  = me.getArgs();
        
        console.log('running:', which + ' ' +  args);
        me._attachSpawnListeners(spawn(which, args));

    },

    _attachSpawnListeners: function (spawn) {
        var me = this;
        me._attachEventListener('data', spawn.stdout, me._onProgress);
        me._attachEventListener('data', spawn.stderr, me._onError);
    },

   _attachEventListener: function (event, stream, mthd) {
        stream.on(event, mthd.bind(this));
    },

    _onProgress: function (data) {
        console.log('>' + data);
    },

    _onError: function (data) {
        console.log('error: ' + data);
    }   
});