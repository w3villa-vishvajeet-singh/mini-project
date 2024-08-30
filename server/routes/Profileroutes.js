const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile');
const { validateProfile } = require('../helper/profilevalidatemiddleware');

// Define routes
router.get('/profile', profileController.getProfile); // GET /profile
router.post('/profile', validateProfile, profileController.updateProfile); // POST /profile
router.get('/profile/download', profileController.downloadProfile); // GET /profile/download

module.exports = router;