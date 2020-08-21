const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

const { find, findById, create, update, delete: del } = require('../controllers/users')

const db = [{ name: "李磊" }]

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.put('/:id', update);

router.delete('/:id', del);


module.exports = router;



