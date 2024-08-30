const crypto = require("crypto");
const db = require("../config/dbConnection");
const jwt = require("jsonwebtoken");

const errorResponse = require("../helper/errorResponse.json");
const successResponse = require("../helper/successResponse.json");

const verifyOtp = (req, res) => {
  const token = req.body.token;
  const userOtp = req.body.otp;

  const verificationHash = token;
  console.log("Verification Hash:", verificationHash);

  db.query(
    `SELECT * FROM user_verification_table WHERE verification_hash = ?`,
    [verificationHash],
    (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ msg: errorResponse.databaseErr });
      }

      if (!result || result.length === 0) {
        console.log("No record found for the provided hash.");
        return res.status(400).json({ msg: errorResponse.invalidCredentials });
      }

      const verificationRecord = result[0];
      const currentTime = new Date();

      if (verificationRecord.mobile_verified_at) {
        console.log("OTP already verified.");
        return res.status(400).json({ msg: errorResponse.otpAlreadyVerified });
      }

      if (currentTime > new Date(verificationRecord.otp_expire_at)) {
        console.log("OTP has expired.");
        return res.status(400).json({ msg: errorResponse.otptimeexpired });
      }

      if (userOtp !== verificationRecord.mobile_otp) {
        console.log("Invalid OTP.");
        return res.status(400).json({ msg: errorResponse.invalidCredentials });
      }

      db.query(
        `UPDATE user_verification_table SET mobile_verified_at = NOW() WHERE verification_hash = ?`,
        [verificationHash],
        (err, updateResult) => {
          if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ msg: errorResponse.databaseErr });
          }

          const userId = verificationRecord.verification_hash;

          db.query(
            `UPDATE user_table SET is_mobile_verified = ?, next_action = NULL, mobile_number = ? WHERE verification_hash = ?`,
            [true, verificationRecord.mobile_number, userId],
            (err, userUpdateResult) => {
              if (err) {
                console.error("Database update error:", err);
                return res.status(500).json({ msg: errorResponse.databaseErr });
              }

              const userData = JSON.parse(verificationRecord.user_data);
              const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
              const token = jwt.sign(
                {
                  name: userData.username,
                  email: userData.email,
                },
                jwtSecret,
                { expiresIn: "24h" }
              );

              console.log("OTP verified successfully, token generated.");
              return res.status(200).json({ 
                msg: 'OTP Verified Successfully', 
                token: token 
              });
            }
          );
        }
      );
    }
  );
};

module.exports = { verifyOtp };
