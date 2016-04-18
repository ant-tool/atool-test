const router = require('koa-router')();

router.redirect('/', '/tests/runner.html');

export default {
  'middleware'() {
    return router.routes();
  }
}