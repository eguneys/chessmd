require('./index.css');
require('./notation.css');
require('./ply.css');
require('../assets/pixel.css');

const main = require('./main');

module.exports = main.app;

const test = require('./test').default;
test();
