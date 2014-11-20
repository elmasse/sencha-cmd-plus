'use strict';

var cocktail = require('cocktail');
var path      = require('path');

var withUserHome = require('./withUserHome');

cocktail.mix({
    '@exports' : module,
    '@as'      : 'class',

    '@traits'   : [
        withUserHome
    ],

    retrieveCmdBinPath: function () {
        var home = path.normalize(this.getUserHome()),
            bin  = path.join(home, './bin/Sencha/Cmd');

        return bin;
    }
});
