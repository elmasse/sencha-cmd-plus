'use strict';

var chai        = require('chai');
var proxyquire  = require('proxyquire');
var expect      = chai.expect;
var sinon       = require("sinon");
var sinonChai   = require("sinon-chai");

chai.use(sinonChai);

var mock_fs     = { '@noCallThru': true,  '@global': true };
var cli         = proxyquire('../src/cli', { fs: mock_fs });

var PROCESS_ARGV_NO_ARGS = ['node', 'file'];
var PROCESS_ARGV_LIST    = ['node', 'file', 'list'];
var PROCESS_ARGV_USE     = ['node', 'file', 'use'];
var CMD_BIN_VERSIONS     = ['3.0.0', '4.0.4.84', '5.0.3.253'];
var CMD_BIN_VERSIONS_ALL = ['repo', '.DS_Store'].concat(CMD_BIN_VERSIONS);


describe('cmd-plus', function () {

    // CREATE --------------------------
    describe('create cli', function () {

        it('should create a cmd if no args are passed', function(){
            var sut = cli.create(PROCESS_ARGV_NO_ARGS);
            
            expect(sut).to.be.defined;
            expect(sut).to.respondTo('run');
        });

        it('should create a cmd if `list` is passed as first param', function(){
            var sut = cli.create(PROCESS_ARGV_LIST);
            
            expect(sut).to.be.defined;
            expect(sut).to.respondTo('run');
        });

        it('should create a cmd if `use` is passed as first param', function(){
            var sut = cli.create(PROCESS_ARGV_USE);
            
            expect(sut).to.be.defined;
            expect(sut).to.respondTo('run');
        });

    });  

    // cmd-plus list  ----------------------------
    describe('run with list option', function () {

        function mockWith(files, errors) {
            mock_fs.readdir = function(dir, cb) {
                return cb(errors, files);
            };
        }

        var sut = cli.create(PROCESS_ARGV_LIST);
        var onVersionsAvailable = sinon.stub(sut, 'onVersionsAvailable');
        var onNoVersionsAvailable = sinon.stub(sut, 'onNoVersionsAvailable');

        it('should retrieve cmd installed list', function () {
            mockWith(CMD_BIN_VERSIONS);
            sut.run();
            expect(onVersionsAvailable).to.be.calledWith(CMD_BIN_VERSIONS);
        });

        it('should retrieve only cmd installed list and filter other folders like repo and hidden', function () {
            mockWith(CMD_BIN_VERSIONS_ALL);
            sut.run();
            expect(onVersionsAvailable).to.be.calledWith(CMD_BIN_VERSIONS);
        });


        it('should retrieve error if path is not found', function () {
            mockWith(null, true);
            sut.run();
            expect(onNoVersionsAvailable).to.be.called;
        });

    });


});