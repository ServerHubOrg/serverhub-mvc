const gulp = require('gulp');
const ts = require('gulp-typescript');
const fs = require('fs');
const path = require('path');
const filter = require('gulp-filter');

gulp.task('default', function () {
	let f = filter(['**', '!lib/**/*.d.ts']);

	if (!fs.existsSync(path.resolve(__dirname + '/dist')))
		fs.mkdirSync(path.resolve(__dirname + '/dist'));
	if (!fs.existsSync(path.resolve(__dirname + '/dist/lib')))
		fs.mkdirSync(path.resolve(__dirname + '/dist/lib'));
	if (!fs.existsSync(path.resolve(__dirname + '/dist/lib/core')))
		fs.mkdirSync(path.resolve(__dirname + '/dist/lib/core'));

	fs.readdirSync('./lib/page').map(file => {
		let oripath = path.resolve(__dirname + '/lib/page/' + file);

		fs.copyFileSync(oripath, path.resolve(__dirname + '/dist/lib/core/' + file));
	});

	gulp.src('./lib/**/*.d.ts')
		.pipe(gulp.dest('./dist/lib/'));

	return gulp.src('./lib/**/*.ts')
		.pipe(f)
		.pipe(ts({
			target: 'es2016',
			noEmitOnError: true,
			module: 'commonJs',
			removeComments: true,
			allowJs: false,
			declaration: true // for developers only.
		}))
		.pipe(gulp.dest('./dist/lib/'));
});