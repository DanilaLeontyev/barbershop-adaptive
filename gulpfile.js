// []- таск который совершается до запуска таска, в котором это прописано

var 
	gulp 		= require("gulp"), 			// Подключаем gulp
	sass 		= require("gulp-sass"), 	// Подключаем SASS
	browserSync = require("browser-sync"),  // Подключаем browserSync (live reload for gulp)
	concat		= require("gulp-concat"),	// конкатенация файлов
	uglify		= require("gulp-uglifyjs"),	// Минификация JS 
	cssnano		= require("gulp-cssnano"),	// Минификация CSS
	rename		= require("gulp-rename"),	// Переименование
	del			= require("del"),			// Удаление
	imagemin	= require('gulp-imagemin'),   	// Подключаем библиотеку для работы с изображениями
	pngquant	= require('imagemin-pngquant'),	// Подключаем библиотеку для работы с png
	cache       = require('gulp-cache'),		// Подключаем библиотеку кеширования
	autoprefixer= require('gulp-autoprefixer')	// Автопрефиксер
;     


gulp.task("sass", function() {					// Таск на создание CSS файла
	return gulp.src("src/sass/main.scss")		// Берем файл main.scss
	.pipe(sass())								// Преобразуем из sass в css
	.pipe(autoprefixer(["last 15 versions", "> 1%", "ie 7", "ie 8" ], {cascade: true}))	// Автопрефиксер
	.pipe(gulp.dest("src/css"))					// Вывод файла в src/css
	.pipe(browserSync.reload({stream: true}))	// Вводим css  в browserSync
});

/*
gulp.task("csslibs", ["sass"], function(){			// Импорт css библиотек
	return gulp.src("src/sass/libs.scss")	// Берем все файлы из библиотеки 
	.pipe(cssnano())						// Сжимаем
	.pipe(rename({							// Переименовывыем
		suffix:".min"						// Добавляется суффикс .min
	}))
	.pipe(gulp.dest("src/css"));			// Выгружаем в папку css
});
*/

gulp.task("scripts", function(){								// Минимфикация файлов
	return gulp.src([											// Берем массив файлов
		"src/libs/jquery/dist/jquery.min.js",					
		"src/libs/magnific-popup/dist/magnific-popup.min.js",	// Библиотека для создания попапов (всего всплывающего по нажатию)
	])
	.pipe(concat("libs.min.js"))								// Конкатенируем все файлы
	.pipe(uglify())												// Минифицируем все файлы
	.pipe(gulp.dest("src/js"))									// Выгружаем в src/js
});


gulp.task("browser-sync", function(){				// Инициализация browserSync
	browserSync({									// Выполняем browserSync
		server: {									// Параметры сервера
			baseDir: "src"							// Директория для сервера - src
		},
		notify: false								// Отключение уведомлений
	});
});


gulp.task("clean", function(){						// Удаление папки dist
	return del.sync("dist");
});

gulp.task("clearCache", function(){						// Очистка кэша
	return cache.clearAll();
});


gulp.task("img", function(){						//Сжатие загружаемых изображений
	return gulp.src('src/img/**/*.{png,jpg,gif}')   // Берем все изображения из src
	.pipe(cache(imagemin({                      // Сжимаем их с наилучшими настройками с учетом кеширования
		interlaced: true,
		optimizationlevel: 3,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest("dist/img"));
	
});

gulp.task("watch", ["browser-sync", "sass", "scripts"], function(){		// Создание таска для слежения за файлами
	gulp.watch("src/sass/**/*.scss", ["sass"]);							// Следим за Sass файлами в папке sass
	gulp.watch("src/*.html", browserSync.reload);						// Слежение за html		
	gulp.watch("src/js/**/*.js", browserSync.reload);					// Слежение за JS	
});

/*

	Для продакшена

*/

gulp.task("build", ["clean", "sass", "img", "scripts"], function(){		// 
	var buildCss = gulp.src("src/css/*.css")
	.pipe(gulp.dest("dist/css"));					// Все CSS файлы в продакшен
	
	var buildFont = gulp.src("src/fonts/**/*")
	.pipe(gulp.dest("dist/fonts"));					// Все шрифты файлы в продакшен
	
	var buildJs = gulp.src("src/js/**/*.js")
	.pipe(gulp.dest("dist/js"));					// Все JS файлы в продакшен
	
	var buildHTML = gulp.src("src/*.html")
	.pipe(gulp.dest("dist"));						// Все файлы HTML в продакшен
});