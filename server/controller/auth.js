const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const queries = require('../helper/queries'); // Ensure the correct path to queries.js
require('dotenv').config()

const app = express();
app.use(session({
  secret: '1ce6fffb03a5d4eb295d3cd9e8562b193746b6a328091a871f51a25a2810cc837bc3d6b1d683e5e3913fe9debca0da613489883db31cd054a8356df78a8a0829',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


console.log('queries module loaded:', queries);
console.log('insertUser function:', queries.insertUser);



// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GoogleClient,
  clientSecret: process.env.GoogleCLientSecret,
  callbackURL: 'http://localhost:8001/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile);// routes/mobileVerify.js
    const express = require('express');
    const router = express.Router();
    const db = require('../config/dbConnection');
    const otplib = require('otplib');
    const sendOtp = require('../helper/sendOtp');
    
    router.post('/mobile_verify', async (req, res) => {
        const { phoneNumber } = req.body;
    
        if (!phoneNumber) {
            return res.status(400).send({ msg: 'Phone number is required' });
        }
    
        try {
            // Generate OTP
            otplib.authenticator.options = { digits: 6, step: 600 }; // 10 minutes validity
            const secret = otplib.authenticator.generateSecret(); // Generate a unique secret for the OTP
            const otp = otplib.authenticator.generate(secret);
    
            // Save OTP to the database
            const query = `
                INSERT INTO otp_table (phone_number, otp, expiry, is_verified)
                VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)
                ON DUPLICATE KEY UPDATE otp = ?, expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
            `;
            await db.query(query, [phoneNumber, otp, otp]);
    
            // Send OTP to the phone number
            await sendOtp(phoneNumber, otp);
    
            res.status(200).send({ msg: 'OTP sent successfully' });
        } catch (error) {
            console.error('Error during OTP generation:', error);
            res.status(500).send({ msg: 'Error during OTP generation' });
        }
    });
    
    module.exports = router;
    

    // Check if user exists in the database
    let user = await queries.getUserByEmail(profile.emails[0].value);
    if (!user) {
      // User does not exist, insert new user
      const newUser = {
        username: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
        next_action: 'mobile_verify'
      };
      console.log('Inserting new user:', newUser);
      await queries.insertUser(newUser);
      console.log('User inserted into the database:', newUser);
      user = newUser;
    } else {
      // User exists, update existing user
      const updatedUser = {
        username: profile.displayName,
        google_id: profile.id,
        next_action: 'mobile_verify'
      };
      console.log('Updating existing user:', updatedUser);
      await queries.updateUserByEmail(profile.emails[0].value, updatedUser);
      console.log('User updated in the database:', updatedUser);
      user = { ...user, ...updatedUser };
    }
    return done(null, user);
  } catch (error) {
    console.error('Error during authentication:', error);
    return done(error);
  }
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.email); // Use a unique identifier (like email or ID)
});

// Deserialize user from the session
passport.deserializeUser(async (email, done) => {
  try {
    const user = await queries.getUserByEmail(email);
    done(null, user);
  } catch (err) {
    console.error('Error during deserialization:', err);
    done(err);
  }
});

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  authenticate: passport.authenticate('google', { scope: ['profile', 'email'] }),
  callback: (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/users/login' }, (err, user, info) => {
      if (err) {
        console.error('Error during authentication:', err);
        return next(err);
      }
      if (!user) {
        return res.redirect('/users/login');
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return next(loginErr);
        }

        console.log("Authenticated user:", user);
        if (user.next_action === 'mobile_verify') {
          res.redirect(`http://localhost:3000/mobile_number_verify?token=${user.verification_hash}`);
        } else {
          const token = generateToken(user);
          res.json({ token });
        }
      });
    })(req, res, next);
  },
  dashboard: (req, res) => {
    if (req.isAuthenticated()) {
      res.send(`Welcome ${req.user.username}!`);
    } else {
      res.redirect('/');
    }
  }
};
