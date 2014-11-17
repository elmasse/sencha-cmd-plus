'use strict';

var cocktail = require('cocktail');
var withCmdVersions = require('./withCmdVersions');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@requires': ['getUserHome'],

    '@traits': [withCmdVersions],

    run: function () {
        this.retrieveCmdVersions()
            .map(function(item){
                console.log(item);
            });
    }

});