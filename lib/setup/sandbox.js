
var sinon = require('sinon');
var sanbox = sinon.sandbox.create();

afterEach(function() {
  sanbox.restore();
});


global.sandbox = sanbox;