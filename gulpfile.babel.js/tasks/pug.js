import { resolve } from 'path';
import { src, dest } from 'gulp';
import pug from 'gulp-pug';
import pugbem from "gulp-pugbem";
import beautify from 'gulp-beautify';
import browsersync from 'browser-sync';
import frontMatter from 'gulp-front-matter';

import { outputPath } from '../env';
import { templatesPath, htmlFormatConfig } from '../config';

import { getData } from '../get-data';

export const pugWatchPaths = [
  `${templatesPath}/*.pug`,
  `${templatesPath}/pages/*.pug`,
  `${templatesPath}/**/*.pug`,
  `${templatesPath}/**/*.json`,
];

export default () =>
  src([
    `${templatesPath}/pages/*.pug`,
    `${templatesPath}/pages/**/*.pug`,
    `!${templatesPath}/_*.*`,
    `!${templatesPath}/**/_*.*`,
  ])
    .pipe(frontMatter({ property: 'data' }))
    .pipe(pug({
      data: getData(),
      basedir: [templatesPath],
      plugins: [pugbem],
      verbose: false,
      pretty: true,
      debug: false,
    }))
    .pipe(beautify.html(htmlFormatConfig))
    .pipe(dest(resolve(outputPath)))
    .on('end', browsersync.reload);
