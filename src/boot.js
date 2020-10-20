require('./index.css');
require('./notation.css');
require('./ply.css');
require('../assets/pixel.css');

const main = require('./main');

module.exports = main.app;
module.exports.md = require('./md');
