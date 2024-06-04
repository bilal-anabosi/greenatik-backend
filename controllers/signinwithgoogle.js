const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');



const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

mongoose.connect('mongodb://localhost:27017/Greenatik', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  role: String,
});

const User = mongoose.model('User', userSchema);



app.post('/user/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: 'YOUR_GOOGLE_CLIENT_ID',
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, email, name, role: 'user' }); 
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id, role: user.role }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

