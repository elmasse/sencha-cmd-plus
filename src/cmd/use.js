'use strict';

var cocktail        = require('cocktail');
var path            = require('path');
var fs              = require('fs');

var withSpawn  = require('./withSpawn');
var withCmdBin = require('./withCmdBin');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@requires': [
        'getArgs'
    ],

    '@traits': [
        withSpawn,
        withCmdBin
    ],


    run: function () {
        var me   = this,
            args = me.getArgs(),
            opts = args.splice(0, 2),
            bin  = me.retrieveCmdBinPath(),
            ver  = opts.pop(),
            cmd  = path.join(bin, ver, 'sencha');

        if (!fs.existsSync(cmd)) {
            return me.onNoVersionInstalled(ver);
        }

        me.runSpawn(cmd, args);

    },

    onNoVersionInstalled: function(ver) {
        console.error('Sencha Cmd v' + ver + ' is not installed');
    }


});
