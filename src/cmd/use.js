'use strict';

var cocktail        = require('cocktail');
var path            = require('path');
var fs              = require('fs');

var withSpawn       = require('./withSpawn');
var withCmdVersions = require('./withCmdVersions');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@requires': [
        'getArgs'
    ],

    '@traits': [
        withSpawn,
        withCmdVersions
    ],

    resolveCmd: function () {
        var fromCfg = this.retrieveFromArgs(),
            cmd = 'sencha';

        if (fromCfg && fs.existsSync(fromCfg)) {
            cmd = fromCfg;
        }

        return cmd;
    },

    retrieveFromArgs: function () {
        var args    = this.getArgs().splice(0,2),
            bin     = this.retrieveCmdBinPath();

        return path.join(bin, args.pop(), 'sencha');

    }

});
