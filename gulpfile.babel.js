import gulp from 'gulp';
import tslint from 'gulp-tslint';
import log from 'fancy-log';
import sass from 'gulp-sass';
import typescript from 'gulp-typescript';
import uglify from 'gulp-uglify-es';
import connect from 'gulp-connect';
import concat from 'gulp-concat';
import del from 'del';
import sassLint from 'gulp-sass-lint';
import typedoc from 'gulp-typedoc';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

var devbuild = false;

gulp.task('clean:dist', () => {
log('== Cleaning dist ==');
return del(['dist/**/*']);
});

gulp.task('clean:docs', () => {
  log('== Cleaning docs ==');
  return del(['docs/**/*']);
});

gulp.task('clean:temp', () => {
  log('== Cleaning temp ==');
  return del(['dist/js-pure/**/*.*']);
});

gulp.task('readme', () => {
  log('== Assembling documentation files ==');
  return gulp.src(['src/**/*.ts'])
    .pipe(typedoc({
      // TypeScript options (see typescript docs)
      module: 'commonjs',
      target: 'es5',
      excludeExternals: true,
      includeDeclarations: true,
      // Output options (see typedoc docs)
      out: './docs',
      // TypeDoc options (see typedoc docs)
      name: 'time-cop',
      theme: 'markdown',
      plugins: ['mdFlavour bitbucket'],
      ignoreCompilerErrors: false,
      version: true,
    }));
});

gulp.task('tslint', () => {
  log('== Lintifying the ts files ==');
  return gulp.src('src/**/*.ts')
    .pipe(tslint({
        formatter: 'verbose'
    }))
    .pipe(tslint.report({
        emitError: false
    }))
});

gulp.task('sasslint', () => {
  log('== Lintifying the ts files ==');
  return gulp.src(['src/scss/**/*.s+(a|c)ss'])
    .pipe(sassLint({
      options: {
        formatter: 'stylish'
      },
      files: {ignore: 'src/scss/reset_author_richard_clark.scss'},
      rules: {
        'hex-length': [
          2, // Severity 2 (error)
          {
            'style': 'long'
          }
        ],
        'no-color-literals': 0,
        'no-ids': 0,
        'no-mergeable-selectors': 0,
        'no-vendor-prefixes': [
          1, // Severity 1 (warning)
          {
            'excluded-identifiers': [
              'webkit',
              'moz'
            ]
          }
        ]
      }
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('html', () => {
  log('== Copying index.html to dist ==');
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('font-awesome', () => {
  log('== Copying font-awesome.css to dist ==');
  return gulp.src('src/scss/font-awesome/font-awesome.min.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('loading-bar', () => {
  log('== Copying loading-bar.min.css to dist ==');
  return gulp.src('src/scss/loading-bar.min.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('loading-bar-script', () => {
  log('== Copying loading-bar.min.js to dist ==');
  return gulp.src('src/assets/libraries/loading-bar.min.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

gulp.task('font-awesome-fonts', () => {
  log('== Copying font-awesome fonts to dist ==');
  return gulp.src('src/scss/font-awesome/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(connect.reload());
});

gulp.task('assets', () => {
  log('== Copying index.html to dist ==');
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(connect.reload());
});

gulp.task('typescript', () => {
  log('== Transmogrifying ts to js ==');
  return gulp.src('src/**/*.ts')
    .pipe(typescript({
      noImplicitAny: true,
      sourceMap: true,
      module: "commonjs",
      skipLibCheck: true,
      target: 'ESNext'
    }))
      .on('error', log)
    .pipe(gulp.dest('dist/js-pure'));
});

gulp.task('bundle', () => {
  log('== Bundling the js ==');
  return browserify('dist/js-pure/index.js')
      .on('error', log)
    .bundle()
      .on('error', log)
    .pipe(source('bundle.js'))
      .on('error', log)
    .pipe(buffer())
    .pipe(gulp.dest('dist/' + (devbuild ? 'js/' : 'js-pure/')))
});

gulp.task('fuglify', () => {
  log('== Fuglifying the js ==');
  return gulp.src('dist/js-pure/bundle.js')
    .pipe(uglify())
      .on('error', log)
    .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', () => {
  log('== Converting scss to css ==');
  return gulp.src([
    'src/scss/reset_author_richard_clark.scss',
    'src/scss/*.scss'
  ])
    .pipe(sass({style: 'expanded'}))
      .on('error', log)
    .pipe(concat('styles.css'))
      .on('error', log)
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('scripts:reload', (callback) => {
  gulp.series('clean:temp', 'typescript', 'bundle', 'fuglify', 'reload')(callback);
});

gulp.task('connect', () => {
  log('== Opening live reload server ==');
  return connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('reload', () => {
  log('== reloading ==');
  return gulp.src('dist/index.html')
    .pipe(connect.reload());
});

gulp.task('envSet', (callback) => {
  devbuild = true;
  callback();
});

gulp.task('watch', () => {
  gulp.watch('src/assets/**/*', ['assets']);
  gulp.watch('src/ts/**/*.ts', ['scripts:reload']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/index.html', ['html']);
});

gulp.task('devbuild', gulp.series(
  'clean:dist',
  ['tslint', 'sasslint'],
  ['assets', 'html', 'sass', 'loading-bar', 'font-awesome', 'font-awesome-fonts', 'typescript'],
  'loading-bar-script',
  'bundle'
));

gulp.task('build', gulp.series(
  'clean:dist',
  ['tslint', 'sasslint'],
  ['assets', 'html', 'sass', 'loading-bar', 'font-awesome', 'font-awesome-fonts', 'typescript'],
  'loading-bar-script',
  'bundle',
  'fuglify'
));

gulp.task('typedoc', gulp.series(
  'clean:docs',
  'readme'
));

gulp.task('lint', gulp.series(
  ['tslint', 'sasslint']
));

gulp.task('default', gulp.series(
  'envSet',
  'clean:dist',
  ['assets', 'html', 'sass', 'loading-bar', 'font-awesome', 'font-awesome-fonts', 'typescript'],
  'loading-bar-script',
  'bundle',
  'connect'
));