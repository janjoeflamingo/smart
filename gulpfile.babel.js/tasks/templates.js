import { resolve } from 'path';
import { src, dest } from 'gulp';
import beautify from 'gulp-beautify';
import browsersync from 'browser-sync';
import frontMatter from 'gulp-front-matter';
import nunjucksRender from 'gulp-nunjucks-render';

import { outputPath, development } from '../env';
import { templatesPath, htmlFormatConfig } from '../config';

import { getData } from '../get-data';

export const templatesWatchPaths = [
  `${templatesPath}/*.html`,
  `${templatesPath}/**/*.html`,
  `${templatesPath}/**/*.json`,
];

nunjucksRender.nunjucks.configure({
  watch: development,
  trimBlocks: true,
  lstripBlocks: false,
});

export default () =>
  src([
    `${templatesPath}/pages/*.html`,
    `${templatesPath}/pages/**/*.html`,
    `!${templatesPath}/_*.*`,
    `!${templatesPath}/**/_*.*`,
  ])
    .pipe(frontMatter({ property: 'data' }))
    .pipe(nunjucksRender({
      data: getData(),
      path: [templatesPath],
      envOptions: {
        watch: development,
      }
    }))
    .pipe(beautify.html(htmlFormatConfig))
    .pipe(dest(resolve(outputPath)))
    .on('end', browsersync.reload);
