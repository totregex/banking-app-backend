const express=require('express')
const Auth=require('../middleware/auth')
const deposit=require('../controllers/deposit')
const withdraw=require('../controllers/withdraw')
const transfer=require('../controllers/transfer')
const getTransactions = require('../controllers/getTransactions')
const router = express.Router();

router.post('/deposit', Auth, deposit)
router.post('/withdraw',Auth, withdraw)
router.post('/transfer',Auth, transfer)
router.get('/',Auth, getTransactions)

module.exports = router