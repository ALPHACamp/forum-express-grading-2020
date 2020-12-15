const adminController = {
  getAdmin: (req, res) => {
    return res.redirect('/admin/restaurants');
  },
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants');
  },
};

module.exports = adminController;
