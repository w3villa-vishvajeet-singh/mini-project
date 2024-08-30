const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const db = require('../config/dbConnection'); // Ensure this points to the correct database connection

// Fetch profile
const getProfile = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM profiles WHERE id = 1');
        if (rows.length) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    const { name, age, location, gender, occupation } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE profiles SET name = ?, age = ?, location = ?, gender = ?, occupation = ? WHERE id = 1',
            [name, age, location, gender, occupation]
        );
        if (result.affectedRows) {
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Download profile as PDF
const downloadProfile = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM profiles WHERE id = 1');
        if (!rows.length) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const profile = rows[0];
        const html = `
            <h1>Profile Details</h1>
            <p><strong>Name:</strong> ${profile.name}</p>
            <p><strong>Age:</strong> ${profile.age}</p>
            <p><strong>Location:</strong> ${profile.location}</p>
            <p><strong>Gender:</strong> ${profile.gender}</p>
            <p><strong>Occupation:</strong> ${profile.occupation}</p>
        `;

        pdf.create(html).toStream((err, stream) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).json({ error: 'Error generating PDF' });
            }
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (error) {
        console.error('Error downloading profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile, downloadProfile };