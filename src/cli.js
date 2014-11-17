'use strict';

var cocktail = require('cocktail');

var senchaCmd  = require('./cmd/sencha'); 
var listCmd    = require('./cmd/list');
var noOpCmd    = require('./cmd/noop.js');

//TODO: Review this, maybe using nopts
var CMD_OPTIONS = {
    'use'  : [noOpCmd],
    'list' : [listCmd]
};


cocktail.mix({
    '@exports': module,
    '@as': 'class',

    '@static': {
        
        create: function (args) {
            var Module  = this,
                pargs   = args.slice(2),
                talents = Module._cmdByArgs(pargs),
                cli;

            cli = new Module(pargs);

            cocktail.mix(cli, {'@talents': talents});

            return cli;
        },

        _cmdByArgs: function (pargs) {
            var first   = pargs && pargs[0],
                options = CMD_OPTIONS;

            return options[first] || [senchaCmd];
        }
    },

    '@properties': {
        args: undefined
    },

    constructor: function (args) {
        this.setArgs(args);
    }

});

