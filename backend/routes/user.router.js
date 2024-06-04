const { Router } = require("express");
const controller = require('../controllers/user.controller.js');
const validation2 = require('../middelware/validation.js');
const { signinschema, signupschema } = require('../controllers/user.validation.js');



const router = Router();
router.post('/signup',validation2(signupschema), controller.signup);
router.post('/login',validation2(signinschema), controller.login);
router.patch('/sendcode',controller.sendcode);
router.patch('/forgetpassword',controller.forgetpassword);




module.exports = router;