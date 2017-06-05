const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf =require('rimraf');


gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// компиляция шаблонов
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
           pretty: true // для того, чтобы текст html выводился не в строку
        }))
        .pipe(gulp.dest('build'))//куда положить
});


//css

gulp.task('style:compile', function () {
    return gulp.src('source/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

//sprite - image

gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath:'../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.pipe(gulp.dest('build/images/'));
    spriteData.pipe(gulp.dest('source/styles/global/'));
    cb();
});
//delete
gulp.task('clean', function del(cb) {
    return rimraf('build',cb);
});

//copy fonts

gulp.task('copy:fonts',function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
    
});
//copy images

gulp.task('copy:images',function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));

});
//copy
gulp.task('copy',gulp.parallel('copy:fonts','copy:images'));

//watch

gulp.task('watch', function () {
    gulp.watch('source/template/**/*.pug',gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss',gulp.series('style:compile'));
});

//default
gulp.task('default' , gulp.series(
    'clean',
    gulp.parallel('templates:compile','style:compile','sprite','copy'),
    gulp.parallel('watch','server')
));