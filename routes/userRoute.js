const express=require('express')
const getUser=require('../controllers/getUser');
const deleteUser=require('../controllers/delete')
const pinChange = require('../controllers/pin')
const Auth = require('../middleware/auth')
const router = express.Router();

router.get('/', Auth ,getUser)
router.delete('/', Auth ,deleteUser)
router.put('/',Auth, pinChange)

module.exports = router