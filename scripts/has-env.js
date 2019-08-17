const dotenv = require("dotenv-safe");

try {
  dotenv.config()
}
catch (ex) {
  console.log(ex.toString());
}
