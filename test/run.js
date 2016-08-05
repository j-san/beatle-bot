/* eslint-env mocha */
/* global require */

import 'mocha/mocha.css';
import 'mocha/mocha.js';

if (window.initMochaPhantomJS) {
    window.initMochaPhantomJS();
}
mocha.setup('bdd');

require('./TestBot.js');
require('./TestProgram.js');

mocha.run();
