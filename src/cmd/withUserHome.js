'use strict';

var cocktail = require('cocktail');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    getUserHome: function () {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    }
});
