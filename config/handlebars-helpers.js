const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
      }
    return options.inverse(this)
  },
  moment: function(a){ //將絕對時間換成相對時間
    return moment(a).fromNow()
  }
}