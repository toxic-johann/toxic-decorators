import base from './rollup.config.base';
export default Object.assign(base('es'), {
  output: {
    format: 'es',
    file: 'lib/toxic-decorators.mjs',
  }
});
