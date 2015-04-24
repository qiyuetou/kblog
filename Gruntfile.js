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
        staticize: {
            task: {
                rev: {
                    all: {
                        files: ['online/**/static/**/*.{css,js,jpg,png,gif}']
                    }
                },
                rep: {
                    all: {
                        files: ['online/static/**/*.{css,js,jade}', 'online/**/*.jade', '!online/msite/**/*.*', '!online/mstaticize/**/*.*'],
                        assetsDirs: 'online/static/',
                        patterns: /([\w\-\.]+){0,1}(\/[\w\-\.]+)*\.\w+/mg
                    },
                    msite: {
                        files: ['online/msite/static/**/*.{css,js}', 'online/msite/**/*.jade'],
                        assetsDirs: 'online/msite/static/',
                        patterns: /([\w\-\.]+){0,1}(\/[\w\-\.]+)*\.\w+/mg
                    },
                    mstaticize: {
                        files: ['online/mstaticize/static/**/*.{css,js,jade}', 'online/mstaticize/**/*.jade'],
                        assetsDirs: 'online/mstaticize/static/',
                        patterns: /([\w\-\.]+){0,1}(\/[\w\-\.]+)*\.\w+/mg
                    }
                },
                pkg: {
                    online: {
                        directory: 'online/',
                        target: 'online/online.tar.gz'
                    }
                }
            }
        },
        uglify: {
            www: {
                files: [{
                    expand: true,
                    cwd: 'online/static/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'online/static/',
                    ext: '.js'
                }]
            },
            msite: {
                files: [{
                    expand: true,
                    cwd: 'online/msite/static/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'online/msite/static/',
                    ext: '.js'
                }]
            },
            mstaticize: {
                files: [{
                    expand: true,
                    cwd: 'online/mstaticize/static/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'online/mstaticize/static/',
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


    grunt.registerTask('default', ['compass', 'imagemin', 'cssmin', 'watch']);
    grunt.registerTask('online', ['clean', 'copy', 'uglify', 'staticize']); //, 
};