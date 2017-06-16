const version = process.env.VERSION || require('../package.json').version;
const banner = `
/**
 * toxic-decorators v${version}
 * (c) 2017-${new Date().getFullYear()} toxic-johann
 * Released under GPL-3.0
 */
`;
import flow from 'rollup-plugin-flow-no-whitespace';
import includePaths from 'rollup-plugin-includepaths';
import babel from 'rollup-plugin-babel';
const babelConfig = {
  common: {
    presets: [
      'flow',
      ['latest', {es2015: {modules: false}}],
      'stage-0'
    ],
    plugins: ['transform-runtime'],
    runtimeHelpers: true,
    babelrc: false
  },
  es: {
    presets: [
      'flow',
      ['latest', {es2015: {modules: false}}],
      'stage-0'
    ],
    plugins: ['transform-runtime'],
    runtimeHelpers: true,
    babelrc: false
  },
  umd: {
    presets: ['flow', 'es2015-rollup', 'stage-0'],
    plugins: [],
    babelrc: false
  },
  iife: {
    presets: ['flow', 'es2015-rollup', 'stage-0'],
    plugins: [],
    babelrc: false
  },
  min: {
    presets: ['flow', 'es2015-rollup', 'stage-0'],
    plugins: [],
    babelrc: false
  }
};
export default function (mode) {
  return {
    entry: 'src/index.js',
    banner,
    plugins: [
      babel(babelConfig[mode]),
      flow(),
      includePaths({
        include: {},
        paths: ['src'],
        external: [],
        extensions: ['.js']
      })
    ]
  }
};
