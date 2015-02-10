'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      targets: ['src/**/*.js', 'test/**/*.js']
    },
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
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('lint', ['eslint']);
  // Default task.
  grunt.registerTask('default', ['lint', 'test']);

};
