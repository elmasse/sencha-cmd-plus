'use strict';

var cocktail        = require('cocktail');
var pkg             = require('../../package');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    run: function () {
        console.log('cmd-plus v' + pkg.version);
    }
});
