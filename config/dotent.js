module.exports = {
  loadEnv: () => {
    if (process.env.NODE_ENV !== 'prouction') {
      require('dotenv').config()
    }
  }
}