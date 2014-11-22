'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    simplemocha: {
      src: 'test/**/*.js',
      options: {
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
      }
    }


  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Default task.
  grunt.registerTask('test', ['simplemocha']);

  grunt.registerTask('default', ['test']);

};
