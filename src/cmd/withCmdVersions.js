'use strict';

var cocktail = require('cocktail');
var fs       = require('fs');
var path     = require('path');
var glob     = require('glob');

var withUserHome = require('./withUserHome');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@traits': [withUserHome],

    retrieveCmdBinPath: function () {
        var home = path.normalize(this.getUserHome()),
            bin  = path.join(home, './bin/Sencha/Cmd');

        return bin;
    },


    retrieveCmdVersions: function () {
        var bin = this.retrieveCmdBinPath();

         return fs.readdirSync(bin)
            .filter(function(item){
                return item !== 'repo';
            });
    },

    retrieveFromSechaCfg: function () {
        var cfg;

        cfg = glob.sync('./.sencha/**/sencha.cfg', {});

        return cfg.length && this.readCmdVersionFromCfg(cfg[0]); 

    },

    readCmdVersionFromCfg: function (pathToCfg) {
        var bin  = this.retrieveCmdBinPath(),
            cfg  = fs.readFileSync(pathToCfg, {encoding:'utf8'}),
            regex = /(?:(?:app|workspace)\.cmd\.version=)(\S*)/,
            match, cmd;

        match = cfg.match(regex);
        cmd = match && path.join(bin, match.pop(), 'sencha');

        return cmd;
    }

});
