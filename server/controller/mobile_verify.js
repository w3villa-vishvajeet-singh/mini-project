const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");
const otplib = require('otplib');


const sendotp = async (req, res) => {
    console.log(req.body); // Verify what is being logged

    const { phoneNumber } = req.body; // Ensure this is what you're sending

    // Fetch the user based on the mobile number
    db.query(`SELECT * FROM user_table WHERE mobile_number = ?`, [phoneNumber], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ msg: 'Database query error' });
        }

        if (!result || !result.length) {
            return res.status(400).send({ msg: 'User not found' });
        }

        const user = result[0];

        // Generate OTP
        otplib.authenticator.options = { digits: 6, step: 600 }; // 10 minutes validity
        const secret = otplib.authenticator.generateSecret(); // Generate a unique secret for the user
        const mobileOtp = otplib.authenticator.generate(secret);
        console.log(`Generated OTP: ${mobileOtp}`);

        // Update the database with the new OTP, mobile number, and its expiry
        const query = `
            UPDATE user_table
            SET mobile_otp = ?, otp_expire_at = DATE_ADD(NOW(), INTERVAL 2 MINUTE), otp_secret = ?
            WHERE mobile_number = ?
        `;

        db.query(query, [mobileOtp, secret, phoneNumber], async (err, result) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send({ msg: 'Database update error' });
            }

            // Send OTP to the mobile number
            try {
                await sendOtpToMobile(phoneNumber, mobileOtp); // Use the correct function to send OTP
                console.log(`OTP sent to ${phoneNumber}`);
                return res.status(200).send({ msg: 'OTP sent successfully' });
            } catch (sendOtpError) {
                console.error('Error sending OTP:', sendOtpError);
                return res.status(500).send({ msg: 'Error sending OTP' });
            }
        });
    });
};

module.exports = { sendotp };
