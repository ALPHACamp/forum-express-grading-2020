const adminController = {
  getAdmin: (req, res) => {
    return res.redirect('/admin/restaurants');
  },
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
      });
      return res.render('admin/restaurants', { restaurants: restaurants });
    } catch (err) {
      console.log(err);
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/restaurants/create');
  },
  postRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist");
        return res.redirect('back');
      }
      // const { file } = req;
      // if (file) {
      //   imgur.setClientID(IMGUR_CLIENT_ID);
      //   imgur.upload(file.path, (err, img) => {
      //     return Restaurant.create({
      //       name: req.body.name,
      //       tel: req.body.tel,
      //       address: req.body.address,
      //       opening_hours: req.body.opening_hours,
      //       description: req.body.description,
      //       image: file ? img.data.link : null,
      //       CategoryId: req.body.categoryId,
      //     }).then((restaurant) => {
      //       req.flash("success_messages", "restaurant was successfully created");
      //       return res.redirect("/admin/restaurants");
      //     });
      //   });
      // }

      await Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId,
      });
      req.flash('success_messages', 'restaurant was successfully created');
      return res.redirect('/admin/restaurants');
    } catch (err) {
      console.log(err);
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(
        req.params.id
        // , { include: [Category] }
      );
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON(),
      });
    } catch (err) {
      console.log(err);
    }
  },
  editRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      return res.render('admin/create', {
        restaurant: restaurant.toJSON(),
        // categories: categories,
      });
    } catch (err) {
      console.log(err);
    }
  },
  putRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist");
        return res.redirect('back');
      }

      // const { file } = req;
      // if (file) {
      //   imgur.setClientID(IMGUR_CLIENT_ID);
      //   imgur.upload(file.path, (err, img) => {
      //     return Restaurant.findByPk(req.params.id).then((restaurant) => {
      //       restaurant
      //         .update({
      //           name: req.body.name,
      //           tel: req.body.tel,
      //           address: req.body.address,
      //           opening_hours: req.body.opening_hours,
      //           description: req.body.description,
      //           image: file ? img.data.link : restaurant.image,
      //           CategoryId: req.body.categoryId,
      //         })
      //         .then((restaurant) => {
      //           req.flash(
      //             'success_messages',
      //             'restaurant was successfully to update'
      //           );
      //           res.redirect('/admin/restaurants');
      //         });
      //     });
      //   });
      // } else {
      const restaurant = await Restaurant.findByPk(req.params.id);
      restaurant.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        // image: restaurant.image,
        // CategoryId: req.body.categoryId,
      });
      req.flash('success_messages', 'restaurant was successfully to update');
      return res.redirect('/admin/restaurants');
    } catch (err) {
      console.log(err);
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      restaurant.destroy();
      return res.redirect('/admin/restaurants');
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = adminController;
