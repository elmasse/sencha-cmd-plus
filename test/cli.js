'use strict';

var chai        = require('chai');
var proxyquire  = require('proxyquire');
var expect      = chai.expect;
var sinon       = require("sinon");
var sinonChai   = require("sinon-chai");

chai.use(sinonChai);

var mock_fs     = { '@noCallThru': true,  '@global': true };
var mock_glob   = { '@noCallThru': true,  '@global': true };
var cli         = proxyquire('../src/cli', { fs: mock_fs, glob: mock_glob });

var PROCESS_ARGV_NO_ARGS = ['node', 'file'];
var PROCESS_ARGV_LIST    = ['node', 'file', 'list'];
var PROCESS_ARGV_USE     = ['node', 'file', 'use'];
var PROCESS_ARGV_VERSION = ['node', 'file', 'version'];
var PROCESS_ARGV_SENCHA  = ['node', 'file', 'which'];

var CMD_BIN_VERSIONS     = ['3.0.0', '4.0.4.84', '5.0.3.253'];
var CMD_BIN_VERSIONS_ALL = ['repo', '.DS_Store'].concat(CMD_BIN_VERSIONS);


describe('cmd-plus', function () {
    
    function mockReadDirWith(files, errors) {
        mock_fs.readdir = function(dir, cb) {
            return cb(errors, files);
        };
    }

    function mockFileExistsWith(mocked) {
        mock_fs.existsSync = function() {
            return mocked;
        };
    }

    function mockReadFileWith(mockedContent, error) {
        mock_fs.readFile = function(file, opts, cb){
            return cb(error, mockedContent);
        }
    }

    function mockGlobWith(files, errors) {
        mock_glob.glob = function(path, opts, cb) {
            return cb(errors, files);
        }
    }

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

        it('should create a cmd if `version` is passed as first param', function(){
            var sut = cli.create(PROCESS_ARGV_VERSION);
            
            expect(sut).to.be.defined;
            expect(sut).to.respondTo('run');
        });

    });  

    // cmd-plus list  ----------------------------
    describe('run with list option', function () {



        var sut = cli.create(PROCESS_ARGV_LIST);
        var onVersionsAvailable = sinon.stub(sut, 'onVersionsAvailable');
        var onNoVersionsAvailable = sinon.stub(sut, 'onNoVersionsAvailable');

        it('should retrieve cmd installed list', function () {
            mockReadDirWith(CMD_BIN_VERSIONS);
            sut.run();
            expect(onVersionsAvailable).to.be.calledWith(CMD_BIN_VERSIONS);
        });

        it('should retrieve only cmd installed list and filter other folders like repo and hidden', function () {
            mockReadDirWith(CMD_BIN_VERSIONS_ALL);
            sut.run();
            expect(onVersionsAvailable).to.be.calledWith(CMD_BIN_VERSIONS);
        });


        it('should retrieve error if path is not found', function () {
            mockReadDirWith(null, true);
            sut.run();
            expect(onNoVersionsAvailable).to.be.called;
        });

    });

    // cmd-plus use  ----------------------------
    describe('run with use option', function () {
        
        it('should execute cmd version installed', function () {
            var version = 'version';
            var sut = cli.create(PROCESS_ARGV_USE.concat([version]));
            var runSpawn = sinon.stub(sut, 'runSpawn');    
            var onNoVersionInstalled = sinon.stub(sut, 'onNoVersionInstalled');    
            
            mockFileExistsWith(true);
            sut.run();
            
            expect(onNoVersionInstalled).to.not.be.called;
            expect(runSpawn).to.be.called;
        });

        it('should abort if cmd version is not installed', function () {
            var version = 'version';
            var sut = cli.create(PROCESS_ARGV_USE.concat([version]));
            var runSpawn = sinon.stub(sut, 'runSpawn');
            var onNoVersionInstalled = sinon.stub(sut, 'onNoVersionInstalled'); 
            
            mockFileExistsWith(false);
            sut.run();
            
            expect(runSpawn).to.not.be.called;
            expect(onNoVersionInstalled).to.be.called;
        });

    });

    // cmd-plus version  ----------------------------
    describe('run with version option', function () {
        var sut = cli.create(PROCESS_ARGV_VERSION);
        var pck = require('../package');

        it('should display cmd-plus current version', function(){
            var out = sinon.stub(console, 'log');

            sut.run();

            expect(out).to.be.calledWith('cmd-plus v'+pck.version);
            
            console.log.restore();
        });

    });

    // cmd-plus [sencha-cmd]  -----------------------
    describe('run with a sencha cmd', function () {
        var sut          = cli.create(PROCESS_ARGV_SENCHA),
            noVersionSpy = sinon.stub(sut, 'onNoVersionsAvailable'),
            versionSpy   = sinon.stub(sut, 'onVersionsAvailable');

        function testUseDefaultVersion(files, content) {
            mockGlobWith(files);
            mockReadFileWith(content);
            mockFileExistsWith(false);
            
            sut.run();

            expect(noVersionSpy).to.be.called;            
        }

        function testUseVersionFromConfig(files, content) {
            mockGlobWith(files);
            mockReadFileWith(content);
            mockFileExistsWith(true);
            
            sut.run();

            expect(versionSpy).to.be.called;
        }


        // - default version cases

        it('should execute `sencha which` with default version when no sencha.cfg file is found', function(){
            testUseDefaultVersion([])
        });

        it('should execute `sencha which` with default version when app.cmd version from sencha.cfg file is not installed', function(){            
            testUseDefaultVersion(['sencha.cfg'], 'app.cmd.version=version-not-found');
        });     

        it('should execute `sencha which` with default version when workspace.cmd version from sencha.cfg file is not installed', function(){
            testUseDefaultVersion(['sencha.cfg'], 'workspace.cmd.version=version-not-found');
        });  

        it('should execute `sencha which` with default version when package.cmd version from sencha.cfg file is not installed', function(){
            testUseDefaultVersion(['sencha.cfg'], 'package.cmd.version=version-not-found');
        });

        // - configured version cases

        it('should execute `sencha which` with version in app.cmd.version from sencha.cfg file  when it is installed', function(){
            testUseVersionFromConfig(['sencha.cfg'], 'app.cmd.version=version-found');
        });

        it('should execute `sencha which` with version in workspace.cmd.version from sencha.cfg file  when it is installed', function(){
            testUseVersionFromConfig(['sencha.cfg'], 'workspace.cmd.version=version-found');
        });

        it('should execute `sencha which` with version in package.cmd.version from sencha.cfg file  when it is installed', function(){
            testUseVersionFromConfig(['sencha.cfg'], 'package.cmd.version=version-found');
        });
    });

});