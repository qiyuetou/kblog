module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                globals: {
                    angular: true
                }
            },
            files: ['static/js/**/*.js', '!static/js/plug/*.js', '!static/js/*.min.js', '!static/js/jQuery-v1.11.0.js', '!static/js/highlightjs/*.js']
        },
        compass: { // Task
            dist: { // Target
                options: { // Target options
                    sassDir: 'static/sass',
                    cssDir: 'static/css',
                    environment: 'production'
                }
            },
            msite: { // Target
                options: { // Target options
                    sassDir: 'msite/static/sass',
                    cssDir: 'msite/static/css',
                    environment: 'production'
                }
            },
            mstaticize: { // Target
                options: { // Target options
                    sassDir: 'mstaticize/static/sass',
                    cssDir: 'mstaticize/static/css',
                    environment: 'production'
                }
            }
        },
        watch: {
            css: {
                files: ['**/static/sass/**/*.sass', 'static/sass/*.sass'],
                tasks: ['compass'],
                options: {
                    livereload: true
                }
            },
            cssMsite: {
                files: ['msite/static/sass/*/*.sass', 'msite/static/sass/*.sass'],
                tasks: ['compass'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['static/js/*.js', '!static/js/*.min.js'],
                tasks: ['uglify'],
                options: {
                    livereload: 5027
                }
            },
            jsx: {
                files: ['static/jsx/**/*.jsx'],
                tasks: ['browserify'],
                options: {
                    livereload: true
                }
            }

        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'static/',
                src: ['**/*.css', '!build/**/*.css'],
                dest: 'static/',
                ext: '.css'
            }
        },
        imagemin: {
            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'static/img/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'static/img/' // Destination path prefix
                }]
            }
        },
        copy: {
            'online': {
                files: [{
                    expand: true,
                    src: ['**/*.*', '!**/sass/**/*.*'],
                    dest: 'online'
                }]
            }
        },
        clean: {
            online: 'online',
        },
        uglify: {
            js: {
                files: [{
                    expand: true,
                    cwd: 'static/js/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'static/js/',
                    ext: '.min.js'
                }]
            }
        },
        browserify: {
            'react': {
                files: [{
                    expand: true,
                    cwd: 'static/jsx/',
                    src: ['**/*.jsx','!component/**/*.jsx'],
                    dest: 'static/js/',
                    ext: '.js'
                }]
            }
        }

    });

    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-staticize');
    grunt.loadNpmTasks('grunt-browserify');


    grunt.registerTask('default', ['compass', 'imagemin', 'cssmin', 'browserify', 'uglify', 'watch']);
    grunt.registerTask('online', ['clean', 'copy', 'uglify', 'staticize']); //,
    grunt.registerTask('test', ['browserify']); //,
};
