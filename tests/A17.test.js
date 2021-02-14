const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../app')
const routes = require('../routes/index')
const db = require('../models')
const helpers = require('../_helpers');

// 測試開始：分三個層級 describe > context > it
describe('# A17: 使用者權限管理', function () {  // describe 定義測試的大項目

  // context 定義測試情境（要測試的細項）
  context('# [顯示使用者清單]', () => {

    // it 前會宣告獨立測試資料，此處設定一個登入使用者
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, isAdmin: true });  // id 為 1，身份是 admin

      await db.User.destroy({ where: {}, truncate: true })
      await db.User.create({ name: 'User1' }) // 新增 User1
    })

    // 在 it 中檢查實際規格，每個 it 是獨立的
    // 檢查「當 admin 呼叫 GET /admin/users時，能不能正確回傳使用者清單」
    it(" GET /admin/users ", (done) => {
      request(app)
        .get('/admin/users') // 登入的 User1 呼叫 GET /admin/users，執行 adminController.getUsers
        .end(function (err, res) {
          res.text.should.include('User1') // 給登入的 User1 的網頁內容裡應該要能看到 User1 的名字
          done()
        });
    });

    // it 後會清空資料
    after(async () => {
      this.ensureAuthenticated.restore(); // 清空登入狀態
      this.getUser.restore(); // 清空 User1 資料
      await db.User.destroy({ where: {}, truncate: true })
    })

  })

  context('# [修改使用者權限]', () => {
    before(async () => {
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1, isAdmin: true });

      await db.User.destroy({ where: {}, truncate: true })
      await db.User.create({ name: 'User1', isAdmin: false })
    })

    it(" PUT /admin/users/:id/toggleAdmin ", (done) => {
      db.User.findByPk(1).then(user => {
        user.isAdmin.should.equal(false);
        request(app)
          .put('/admin/users/1/toggleAdmin')
          .type("form")
          .end(function (err, res) {
            db.User.findByPk(1).then(user => {
              user.name.should.equal('User1');
              user.isAdmin.should.equal(true);
              return done();
            })
          });
      })
    });

    after(async () => {
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({ where: {}, truncate: true })
    })

  })
})