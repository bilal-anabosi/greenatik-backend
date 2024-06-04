const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel.js'); 
const sendemail = require('../utilts/email.js'); 

const signup = async (req, res) => {

    const { username, email, password,role,address } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
        return res.json({ message: "Email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const createUser = await userModel.create({ username, email, password: hashedPassword,role,address });
    await sendemail(email, `Welcome`, `<h2>Hello ${username}</h2>`);
    return res.status(201).json({ message: "Success", user: createUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credintails" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Invalid credintails" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.LOGINSIG);
    return res.status(200).json({ message: "Success", token });
};

const sendcode = async (req, res) => {
    const { email } = req.body;
    const { customAlphabet } = await import('nanoid');
    const code = customAlphabet('1234567890abcdef', 4)();
    const user = await userModel.findOneAndUpdate({ email }, { sendCode: code }, { new: true });
    if (!user) {
        return res.status(404).json({ message: "Email not found" });
    }
    await sendemail(email, `Reset Password`, `<h2>The code is ${code}</h2>`);
    return res.status(200).json({ message: "Success" });
};

const forgetpassword = async (req, res) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return  res.status(404).json({ message: "Email not found" });
    }
    if (user.sendCode !== code) {
        return  res.status(401).json({ message: "invaild code" });
    }
    user.password = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    user.sendCode = null;
    await user.save();
    return res.status(200).json({ message: "Success2" });
};



module.exports = { signup, login,sendcode,forgetpassword};