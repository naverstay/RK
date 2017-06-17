'use strict';

var gulp = require('gulp'), //сам гулп
  watch = require('gulp-watch'),
  uglify = require('gulp-uglify'), //для минификации скриптов
  sass = require('gulp-sass'), //компилятор sass
  cssmin = require('gulp-clean-css'), //минификатор css
  imagemin = require('gulp-imagemin'), //оптимизатор картнок
  pngquant = require('imagemin-pngquant'),
  rigger = require('gulp-rigger'), //всткавка включашек в любый файлы
  bower = require('gulp-bower'), //менеджер подключаемых библиотек
  concat = require('gulp-concat'), //конкатинация файлов
  filter = require('gulp-filter'),
  prefixer = require('gulp-autoprefixer'), //автоматически добавляет вендрные префиксы
  sourcemaps = require('gulp-sourcemaps'),
  spritesmith = require('gulp.spritesmith'),
  rimraf = require('gulp-rimraf'),
  gutil = require('gulp-util'),
  pug = require('gulp-pug'), // компилятор шаблонов jade/pug
  plumber = require('gulp-plumber'),
  uglifyify = require('uglifyify'), //Сервер для SPA
  puglint = require('gulp-pug-lint');

var scriptsCount = 0;
var path = {
  entry: 'src/app/index.js',
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/markup/',
    js: 'build/markup/js/',
    css: 'build/markup/css/',
    img: 'build/markup/img/',
    images: 'build/markup/images/',
    fonts: 'build/markup/fonts/',
    resources: 'build/markup/resources/'

  },
  src: { //Пути откуда брать исходники
    html: 'src/markup/*.html',
    js: 'src/markup/js/**/*.js',
    jsLibsDir: 'src/markup/js/libs/',
    styleDir: 'src/markup/style/',
    styleLibsDir: 'src/markup/style/libs/',
    style: 'src/markup/style/style.scss', //единая точка входа для стилей
    img: 'src/markup/img/**/*.*',
    images: 'src/markup/images/**/*.*',
    fonts: 'src/markup/fonts/**/*.*',
    resources: 'src/markup/resources/**/*.*',
    sprite: 'src/markup/sprites/*.png' //откуда брать картинки для спрайтов
  },
  watch: {
    html: 'src/markup/**/*.html',
    js: 'src/markup/js/**/*.js',
    style: 'src/markup/style/**/*.scss',
    pug: 'src/markup/templates/**/*.*',
    img: 'src/markup/img/**/*.*',
    imgSprites: 'src/markup/sprites/**/*.*',
    images: 'src/markup/images/**/*.*',
    fonts: 'src/markup/fonts/**/*.*',
    resources: 'src/markup/resources/**/*.*'
  },
  clean: './build/markup/'
};


gulp.task('html', function () {
  gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
});

gulp.task('sprite', function () {
  var spriteData =
    gulp.src(path.src.sprite)
      .pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: 'sprite.scss',
        cssFormat: 'scss'
      }));

  spriteData.img.pipe(gulp.dest(path.build.img)); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest(path.src.styleDir)); // путь, куда сохраняем стили
});

//таска, которая собирает нам наши скрипты
gulp.task('js', function () {
  gulp.src(path.src.js) //Найдем наш main файл
    .pipe(rigger()) //Прогоним через rigger
    .pipe(concat('_main.js'))
    .pipe(sourcemaps.init()) //Инициализируем sourcemap
    .pipe(sourcemaps.write()) //Пропишем карты
    //.pipe(uglify()) //Сожмем наш js
    .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
});


//таска, которая собирает нам наши шрифты
gulp.task('fonts', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});


//таска, которая собирает прочие ресурсы
gulp.task('resources', function () {
  gulp.src(path.src.resources)
    .pipe(gulp.dest(path.build.resources))
});


// JS: берет все моудли из bower.json объединяет в один файл vendor.js скрипты, кладет их в паку дистрибутива
// CSS: берет все файлы, кладет их в _vendor.scss в папке приложения. Потом этот файл будет включаться другим таском в итоговый
gulp.task('bower', function () {
  var bowerFiles = require('main-bower-files')({
    checkExistence: true
  });

  bowerFiles.push('./bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css');
  
  var jsFilter = filter(function (file) {
    return file.path.match(/\.(js)$/i);
  });
  var cssFilter = filter(function (file) {
    return file.path.match(/\.(css)$/i);
  });
  gulp.src(bowerFiles)
    .pipe(jsFilter)
    .pipe(concat('_vendor.js'))
    //.pipe(uglify())
    //.pipe(gulp.dest(path.src.jsLibsDir))
    .pipe(gulp.dest(path.build.js))
  ;

  return gulp.src(bowerFiles)
    .pipe(cssFilter)
    .pipe(concat('_vendor.scss'))
    .pipe(gulp.dest(path.src.styleLibsDir));
});


//таска, которая собирает нам все наши стили
gulp.task('styles', function () {
  gulp.src(path.src.style) //Выберем наш main.scss
    .pipe(plumber()) // предотвращаем вылет гальпа при ошибке
    //.pipe(sourcemaps.init()) //То же самое что и с js
    .pipe(sass()) //Скомпилируем
    .pipe(prefixer()) //Добавим вендорные префиксы
    //.pipe(cssmin()) //Сожмем
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css)) //И в build
});


// таск для компиляции шаблонов
gulp.task('pug', function () {
  gulp.src(['src/markup/templates/*.pug', '!src/markup/templates/_*.pug'])
    .pipe(plumber()) // предотвращаем вылет гальпа при ошибке
    .pipe(pug({
      pretty: true,
      locals: {
        dev: true
      }
    }))
    .pipe(gulp.dest(path.build.html));
});


//таска оптимизирует нам картинки
gulp.task('images', function () {
  gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img));
  gulp.src(path.src.images) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.images));
});

//очищает папку с билдом
gulp.task('clean', function () {
  var del = require('del');
  del([path.clean]);
});

//собственно, вотчер
gulp.task('watch', function () {
  //watch([path.watch.html], function (event, cb) {
  //    gulp.start('html');
  //});
  watch([path.watch.pug], function (event, cb) {
    gulp.start('pug');
  });
  watch([path.watch.style], function (event, cb) {
    gulp.start('styles');
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start('js');
  });
  watch([path.watch.img], function (event, cb) {
    gulp.start('images');
  });
  watch([path.watch.fonts], function (event, cb) {
    gulp.start('fonts');
  });
  watch([path.watch.resources], function (event, cb) {
    gulp.start('resources');
  });
  watch([path.watch.imgSprites], function (event, cb) {
    gulp.start('sprite');
  });
});


gulp.task('build', [
  'clean',
  'bower',
  'js',
  'sprite',
  'styles',
  'pug',
  'fonts',
  'resources',
  'images'
]);

gulp.task('puglint', function () {
  return gulp
    .src('src/markup/templates/*.pug')
    .pipe(puglint());
});

gulp.task('default', ['build', 'watch']);
