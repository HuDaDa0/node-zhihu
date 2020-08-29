const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/topic' });

const { secret } = require('../config');
const { find, findById, create, update, delete: del } = require('../controllers/topics');

const auth = jwt({ secret });


router.get('/', find);
router.post('/', create);
router.get('/:id', findById);
router.patch('/:id', auth, update);
router.delete('/:id', auth, del);


module.exports = router;
