import { development } from './environment.development';
import { production } from './environment.production';
import { qa } from './environment.qa';
import { dev } from './environment.dev';

const environments = {
  development,
  production,
  qa,
  dev,
};

const reactAppEnvironment = process.env.REACT_APP_ENVIRONMENT || 'production';

/* eslint-disable-next-line */
console.log(`%cenvironments => ${reactAppEnvironment}`, 'color: red; font-style: italic;');

const environment = {
  ...environments[reactAppEnvironment],
};

export {
  environment,
};
