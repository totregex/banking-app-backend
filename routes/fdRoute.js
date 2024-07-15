const express=require('express')
const Auth=require('../middleware/auth')
const makeFD=require('../controllers/makeFd')
const getFD=require('../controllers/getFds')
const withdrawFD=require('../controllers/withdrawFd')
const router = express.Router();

router.post('/issue', Auth, makeFD)
router.post('/withdraw', Auth, withdrawFD)
router.get('/', Auth, getFD)

module.exports=router