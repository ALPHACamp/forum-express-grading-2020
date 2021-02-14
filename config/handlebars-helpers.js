const moment = require('moment')
module.exports = {
  ifSelected: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  moment: function (a) {
    return moment(a).fromNow()
  }
}