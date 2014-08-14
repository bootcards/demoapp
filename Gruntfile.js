module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/* This file combines all the (Bower) dependencies this demo app requires\n * <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
   
      concat: {
        js: {
          options: { banner: '<%= banner %>' },
          src: [
         'public/bower_components/bootstrap/dist/js/bootstrap.min.js',
         'public/jqueryui/jquery-ui-1.10.4.custom.min.js',
         'public/bower_components/jquery-pjax/jquery.pjax.js',
         'public/bower_components/fastclick/lib/fastclick.js',
         'public/bower_components/bootstrap-jasny/dist/js/jasny-bootstrap.min.js',
         'public/bower_components/raphael/raphael-min.js',
         'public/bower_components/morris.js/morris.min.js',

         'public/bower_components/jquery.ui/ui/jquery.ui.core.js',

          'public/bower_components/jquery.ui.widget.js',
          'public/bower_components/jquery.ui.mouse.js',
          'public/bower_components/jquery.ui.position.js',
          'public/bower_components/jquery.ui.effect.js',
          'public/bower_components/jquery.ui.effect-blind.js',
          'public/bower_components/jquery.ui.effect-bounce.js',
          'public/bower_components/jquery.ui.effect-clip.js',
          'public/bower_components/jquery.ui.effect-drop.js',
          'public/bower_components/jquery.ui.effect-explode.js',
          'public/bower_components/jquery.ui.effect-fade.js',
          'public/bower_components/jquery.ui.effect-fold.js',
          'public/bower_components/jquery.ui.effect-highlight.js',
          'public/bower_components/jquery.ui.effect-pulsate.js',
          'public/bower_components/jquery.ui.effect-scale.js',
          'public/bower_components/jquery.ui.effect-shake.js',
          'public/bower_components/jquery.ui.effect-slide.js',
          'public/bower_components/jquery.ui.effect-transfer.js'

         ],
         dest: 'public/bootcards-demo-app/bclibs.js'
        },
      css: {
        options: { banner: '<%= banner %>' },
          src: [
         'public/bower_components/bootstrap/dist/css/bootstrap.min.css',
         'public/bower_components/bootstrap-jasny/dist/css/jasny-bootstrap.min.css',
        'public/bower_components/morris.js/morris.css'

        ],
        dest: 'public/bootcards-demo-app/bclibs.css'
      }
     }

  });

  // Load the plugin that provides the "uglify"/ contat task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat:js', 'concat:css']);

};