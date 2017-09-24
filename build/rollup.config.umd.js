import base from './rollup.config.base';
import replace from 'rollup-plugin-replace';
const config = base('umd');
config.plugins.unshift(replace({
  'process.env.NODE_ENV': '"development"'
}));
export default Object.assign(config, {
  output: {
    format: 'umd',
    file: 'lib/toxic-decorators.browser.js'
  },
  name: 'toxicDecorators'
});
