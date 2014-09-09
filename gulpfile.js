var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var ngmin = require('gulp-ngmin');
var rename = require('gulp-rename');
var linker = require('gulp-linker');
var sh = require('shelljs');
var del = require('del');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
    sass: ['scss/**/*.scss'],
    js: ['www/js/app.js', 'www/js/**/*.js', '!www/js/build/*'],
    vendor: ['vendor/**/*.js']
};

gulp.task('default', ['sass', 'lint', 'build-js']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

function combineScripts(sources, name) {
    del('www/js/build/' + name + '.js');
    del('www/js/build/' + name + '.min.js');
    return gulp.src(sources)
        .pipe(concat(name + '.js'))
        .pipe(gulp.dest('www/js/build/'))
        .pipe(uglify())
        .pipe(rename(name + '.min.js'))
        .pipe(gulp.dest('www/js/build/'))
}

gulp.task('build', function () {
    combineScripts(paths.js, 'app');
    combineScripts(paths.vendor, 'vendor');
});

gulp.task('lint', function () {
    gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('link-js', function () {
    gulp.src('www/index.html')
        // Link the JavaScript
        .pipe(linker({
            scripts: paths.js,
            startTag: '<!--SCRIPTS-->',
            endTag: '<!--SCRIPTS END-->',
            fileTmpl: '<script src="%s"></script>',
            appRoot: 'www/'
        }))
        // Write modified files to www/
        .pipe(gulp.dest('www/'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['lint', 'link-js']);
    gulp.watch(paths.vendor, ['build-vendor']);

    gulp.start('link-js');
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
