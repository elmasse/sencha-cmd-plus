'use strict';

var cocktail  = require('cocktail');
var fs        = require('fs');
var path      = require('path');
var glob      = require('glob');

var withCmdBin = require('./withCmdBin');

cocktail.mix({
    '@exports'  : module,
    '@as'       : 'class',

    '@requires' : [
        'onVersionsAvailable',
        'onNoVersionsAvailable'
    ],

    '@traits': [withCmdBin],

    retrieveCmdVersions: function () {
        var me = this,
            bin = me.retrieveCmdBinPath();

        fs.readdir(bin, function(err, files){
            var filtered;

            if (err) {
                return me.onNoVersionsAvailable();    
            }

            filtered = files.filter(function(item){
                return item.indexOf('.') > 0;
            });

            me.onVersionsAvailable(filtered);

        });
    },


    retrieveFromSechaCfg: function () {
        var me = this;

        glob.glob('./.sencha/**/sencha.cfg', {}, function(err, files) {
 
            if (err || !files.length) {
                return me.onNoVersionsAvailable(); 
            }

            fs.readFile(files[0], {encoding:'utf8'}, function(err, content){
                var bin  = me.retrieveCmdBinPath(),
                    regex = /(?:(?:app|workspace|package)\.cmd\.version=)(\S*)/,
                    match, cmd, version;

                if (err) {
                    return me.onNoVersionsAvailable(); 
                } 

                match = content.match(regex);
                version = match.pop();
                cmd = match && path.join(bin, version, 'sencha');

                if ( fs.existsSync(cmd) ) {
                    me.onVersionsAvailable([cmd]);    
                } else {
                    me.onNoVersionsAvailable();
                }
                
            });

        });

    }

});
