// config-env.js

const dotenv = require('dotenv');

function configureEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
  } else if (process.env.NODE_ENV === 'qa') {
    dotenv.config({ path: '.env.qa' });
  } else {
    dotenv.config( { path: '.env.dev' });
  }
}

module.exports = configureEnvironment;
