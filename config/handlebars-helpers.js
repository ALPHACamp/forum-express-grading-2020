module.exports = {
  showRole: function (number) {
    if (number === 1) {
      return 'admin'
    } else {
      return 'user'
    }
  },
  changeRole: function (number) {
    if (number === 1) {
      return 'set as user'
    } else {
      return 'set as admin'
    }
  },
}
