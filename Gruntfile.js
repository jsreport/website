module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                process: function(src, path) {
                    return '\n/* Source: ' + path + ' */\n' + src;
                }
            },
            basic: {
                src: [
                    'public/css/docs.css', 'public/css/metro-bootstrap.css', 'public/css/metro-bootstrap-responsive.css' , 'public/css/style.css',
                    'public/css/font-awesome.min.css', 'public/js/pretify/pretify.css'
                ],
                dest: 'public/jsreport.min.css'
            }
        },
        uglify: {
            basic: {
                files: { 'public/jsreport.min.js': ['public/js/jquery/jquery.min.js', 'public/js/jquery/jquery.widget.min.js',
                'public/js/jquery/jquery.mousewheel.min.js', 'public/js/pretify/pretify.js','public/js/docs.js', 'public/js/github.info.js',
                'public/js/metro.min.js'] }
            }
        }
    });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default',  ['concat:basic', 'uglify']);
}