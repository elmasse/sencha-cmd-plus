'use strict';

var cocktail  = require('cocktail');
var withSpawn = require('./withSpawn');
var withCmdVersions = require('./withCmdVersions');
var fs = require('fs');

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

    resolveCmd: function () {
        var fromCfg = this.retrieveFromSechaCfg(),
            cmd = 'sencha';

        if (fromCfg && fs.existsSync(fromCfg)) {
            cmd = fromCfg;
        }

        return cmd;
    }

});
