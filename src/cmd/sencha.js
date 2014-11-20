'use strict';

var cocktail        = require('cocktail');

var withSpawn       = require('./withSpawn');
var withCmdVersions = require('./withCmdVersions');

/**
 * @trait
 */
cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@traits': [
        withSpawn,
        withCmdVersions
    ],

    run: function () {
        this.retrieveFromSechaCfg();
    },  

    onNoVersionsAvailable: function () {
        var args = this.getArgs();
        this.runSpawn('sencha', args);
    },

    onVersionsAvailable: function (versions) {
        var cmd = versions[0],
            args = this.getArgs();

        this.runSpawn(cmd, args);
    }
});
