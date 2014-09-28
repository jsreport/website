module.exports = function(grunt) {
    grunt.initConfig({
        cssmin: {
            combine: {
                files: {
                    'public/jsreport.min.css': [
                        'public/css/docs.css', 'public/css/metro-bootstrap.css', 'public/css/metro-bootstrap-responsive.css', 'public/css/style.css',
                        'public/css/font-awesome.min.css', 'public/js/pretify/pretify.css'
                    ]
                }
            }
        },

        uglify: {
            basic: {
                files: {
                    'public/jsreport.min.js': ['public/js/jquery/jquery.min.js', 'public/js/jquery/jquery.widget.min.js',
                        'public/js/jquery/jquery.mousewheel.min.js', 'public/js/pretify/pretify.js', 'public/js/docs.js',
                        'public/js/metro.min.js', 'public/js/custom.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['cssmin', 'uglify']);
}