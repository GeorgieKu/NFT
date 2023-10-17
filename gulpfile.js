const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const svgSprite = require('gulp-svg-sprite');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

// Компиляция Pug в HTML
gulp.task('pug', () => {
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Компиляция SCSS в CSS
gulp.task('sass', () => {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('css', () => {
    return gulp.src('src/scss/*.css')
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  });

// Объединение и минификация JS файлов
gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// Оптимизация изображений
gulp.task('images', () => {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

// Создание SVG спрайта
gulp.task('svg', () => {
  return gulp.src('src/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(gulp.dest('dist/svg'))
    .pipe(browserSync.stream());
});

// Перенос шрифтов
gulp.task('fonts', () => {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

// Запуск сервера BrowserSync
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/*.js', gulp.series('scripts'));
  gulp.watch('src/img/*', gulp.series('images'));
  gulp.watch('src/svg/*.svg', gulp.series('svg'));
  gulp.watch('src/fonts/*', gulp.series('fonts'));
});

// Задача по умолчанию
gulp.task('default', gulp.parallel('pug', 'sass', 'scripts', 'images', 'svg', 'fonts', 'serve'));