import { resolve } from 'path';
import { src, dest } from 'gulp';
import sass from 'gulp-sass';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import cssnano from 'cssnano';
import postcss from 'gulp-postcss';
import mqpacker from 'css-mqpacker';
import sassGlob from 'gulp-sass-glob';
import browsersync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import sortCSSmq from 'sort-css-media-queries';
import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import uncss from'postcss-uncss';
import postcssFixes from 'postcss-fixes';
import animation from 'postcss-animation';
import reporter from 'postcss-reporter';
import immutableCss from 'immutable-css';

import { isUncss, staticPath, nodeModulesPath, production, development } from '../env';
import { stylesPath } from '../config';

export const stylesWatchPaths = [
  `${stylesPath}/*.{css,sass,scss}`,
  `${stylesPath}/**/*.{css,sass,scss}`,
];

const plugins = [];

plugins.push(
  atImport(),
  postcssFixes({
    preset: 'safe'
  }),
  mqpacker({
    sort: sortCSSmq,
  }),
  animation(),
  immutableCss({
    verbose: false,
  }),
);

if (production) {
  plugins.push(
    autoprefixer({
      cascade: false,
    }),
    cssnano(),
  );
}

if (isUncss) {
  plugins.push(
    uncss({
      html: ['dist/**/*.html', 'dist/*.html'],
      ignore: [
        '.fade',
        '.active',
        '.disabled',
        '.visible',
        '.hidden',
      ]
    })
  )
}

plugins.push(
  reporter({
    clearMessages: true,
    throwError: false,
  })
)

export default () =>
  src([
    ...stylesWatchPaths,
    `!${stylesPath}/_*.*`,
    `!${stylesPath}/**/_*.*`,
  ])
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: [nodeModulesPath],
    }))
    .pipe(postcss(plugins))
    .pipe(plumber.stop())
    .pipe(gulpif(development, sourcemaps.write('./maps/')))
    .pipe(dest(resolve(staticPath, 'css')))
    .pipe(browsersync.stream());
