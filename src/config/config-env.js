// config-env.js

const dotenv = require('dotenv');

function configureEnvironment() {
  console.log("config env")
  if (process.env.NODE_ENV === 'production') {
    console.log("prod")
    dotenv.config({ path: '.env.production' });
  } else if (process.env.NODE_ENV === 'qa') {
    console.log("qa")
    dotenv.config({ path: '.env.qa' });
  } else {
    console.log("dev")
    dotenv.config( { path: '.env.dev' });
  }
}

module.exports = configureEnvironment;
