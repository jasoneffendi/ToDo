var express = require('express');
var cors = require('cors')
var router = express.Router();
var userCtrl = require('../controllers/user')

router.use(cors())

/* GET home page. */
router.get('/', (req,res) => {
  res.send("It's workin yaw")
});

router.post('/fb', userCtrl.loginFb)

router.get('/fb', userCtrl.get)

router.get('/list', userCtrl.list)

router.post('/', userCtrl.post)

router.delete('/:id', userCtrl.done)

module.exports = router;
