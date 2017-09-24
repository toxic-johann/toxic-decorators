import base from './rollup.config.base';
export default Object.assign(base('common'), {
  output: {
    file: 'lib/toxic-decorators.js',
    format: 'cjs',
  }
});
