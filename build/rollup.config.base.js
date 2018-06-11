const { version, name, author, license } = require('../package.json');
const banner = `
/**
 * ${name} v${version}
 * (c) 2017 ${author}
 * Released under ${license}
 */
`;
import flow from 'rollup-plugin-flow-no-whitespace';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
const babelConfig = {
  common: {
    presets: [
      'flow',
      [ 'env', { modules: false }],
      'stage-0',
    ],
    plugins: [ 'transform-runtime' ],
    runtimeHelpers: true,
    exclude: 'node_modules/**',
    babelrc: false,
  },
  es: {
    presets: [
      'flow',
      [ 'env', { modules: false }],
      'stage-0',
    ],
    plugins: [ 'transform-runtime' ],
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    babelrc: false,
  },
  umd: {
    presets: [ 'flow', 'es2015-rollup', 'stage-0' ],
    plugins: [],
    exclude: 'node_modules/**',
    babelrc: false,
  },
  iife: {
    presets: [ 'flow', 'es2015-rollup', 'stage-0' ],
    plugins: [],
    exclude: 'node_modules/**',
    babelrc: false,
  },
  min: {
    presets: [ 'flow', 'es2015-rollup', 'stage-0' ],
    plugins: [],
    exclude: 'node_modules/**',
    babelrc: false,
  },
};
export default function(mode) {
  return {
    input: 'src/index.js',
    banner,
    external(id) {
      return !/min|umd|iife/.test(mode) && /babel-runtime|toxic-predicate-functions|toxic-utils/.test(id);
    },
    plugins: [
      babel(babelConfig[mode]),
      flow(),
      resolve({
        customResolveOptions: {
          moduleDirectory: [ 'src', 'node_modules' ],
        },
      }),
      commonjs(),
    ],
  };
}
