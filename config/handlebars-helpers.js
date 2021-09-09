const moment = require('moment')

module.exports = {
  ifCond: function (a, b ,options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  ifCounter: function(index) {
    return index += 1
  },

  moment: function(time) {
    return moment(time).fromNow()
  }
}