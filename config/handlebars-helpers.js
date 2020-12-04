const moment = require('moment')

module.exports = {
  ifSame: function (v1, v2, options) {
    return (v1 === v2) ? options.fn(this) : options.inverse(this)
  },

  moment: function (time) {
    return moment(time).fromNow()
  }
}