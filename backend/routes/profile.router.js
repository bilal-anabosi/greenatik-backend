const { Router } = require("express");
const {getProfile,editProfile,getUserPoints} = require('../controllers/profile.controller.js');
const auth = require('../middelware/auth.js');

const fileupload = require("../utilts/multer.js");
const multer = require("multer");
const path = require("path");

const router = Router();


const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
var storage = multer.diskStorage({
destination: function (req, file, cb) {
   cb(null, './uploads/')
},
filename: function (req, file, cb) {
   cb(null, uniqueSuffix + path.extname(file.originalname)) 
}
})

 const upload = multer({ storage: storage })
router.get('/', auth.authenticateToken,getProfile);
router.put('/', auth.authenticateToken,multer( {storage:storage}).single('img'), editProfile);
router.get('/points',auth.authenticateToken, getUserPoints);

module.exports = router;