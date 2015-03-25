'use strict';

var cocktail = require('cocktail');
var spawn    = require('child_process').spawn;

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    runSpawn: function (which, args) {
        spawn(which, args, {stdio: "inherit"});
    }

});
