/*
  script to test if our dotenv runs successfullly from a shell script
  see create-certificate.sh
*/
const dotenv = require("dotenv-safe");

try {
  dotenv.config()
}
catch (ex) {
  console.log(ex.toString());
}
