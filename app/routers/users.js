const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

const { find, findById, create, update, delete: del, login } = require('../controllers/users')

const db = [{ name: "李磊" }]

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.patch('/:id', update);

router.delete('/:id', del);

router.post('/login', login);


module.exports = router;



