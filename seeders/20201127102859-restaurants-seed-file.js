'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants',
      // 在留意 map 語法的時候，注意我們回傳餐廳資料物件時，有包了一個括號，這是在 arrow function 裡沒有寫 return 的情況下，可以用() 來回傳 object literal
      Array.from({ length: 50 }).map((d, i) =>
        ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}