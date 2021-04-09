const dateFns = require('date-fns')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  dateFns: function (a) {
    return dateFns.formatDistanceToNow(a)
  }
}
