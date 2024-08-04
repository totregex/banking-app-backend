const express=require('express')
const Auth=require('../middleware/auth')
const makeFD=require('../controllers/makeFd')
const getFD=require('../controllers/getFds')
const withdrawFD=require('../controllers/withdrawFd')
const getFdOption=require('../controllers/getFdOption')
const router = express.Router();

router.post('/issue', Auth, makeFD)
router.post('/withdraw', Auth, withdrawFD)
router.get('/', Auth, getFD)
router.get('/getFdOption/:option',Auth, getFdOption)
module.exports=router
