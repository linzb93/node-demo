const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello world';
  }
  async user() {
      this.ctx.body = this.ctx.params.id;
  }

  async download() {
      for (let i = 0; i < 2; i++) {
          (async function(i) {
            await new Promise(res => {
                setTimeout(() => {
                    console.log(i);
                    res();
                }, 3000)
            })
          })(i)
      }
  }
}

module.exports = HomeController;