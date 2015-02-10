'use strict';

var cocktail        = require('cocktail');

var withCmdVersions = require('./withCmdVersions');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@traits': [
        withCmdVersions
    ],

    run: function () {
        this.retrieveCmdVersions();
    },

    onVersionsAvailable: function(versions) {
        versions.forEach(function(version){
            console.log(version);
        });
    },

    onNoVersionsAvailable: function () {
        console.error('No Sencha Cmd versions found');
    }

});
