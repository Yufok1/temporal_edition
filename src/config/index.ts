import { config as devConfig } from './development';
import { config as prodConfig } from './production';

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config; 