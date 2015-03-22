var ejs = require('ejs'),
    through = require('through2');

var pattern = /\.(html|ejs)$/;

var wrap = function(template) {
  return 'module.exports = (' + template.toString() + ');';
};

module.exports = function(file, options) {
  if (!pattern.test(file)) {
    return through();
  } else {
    var templateStr = '';

    var transform = function(buf, enc, cb) {
      templateStr += buf.toString('utf8');

      cb();
    };

    var flush = function(cb) {
      var template = ejs.compile(templateStr, {
        client: true,
        compileDebug: options.debug || false
      });

      this.push(wrap(template));

      cb();
    };

    return through(transform, flush);
  }
};
