const conn = require('../config/dbConnection');

const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_verification_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unique_reference_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(500) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      verification_hash VARCHAR(255) NULL,
      expire_at DATETIME NULL,
      otp_expire_at DATETIME NULL,
      email_verified_at DATETIME NULL,
      mobile_verified_at DATETIME NULL,
      is_active BOOLEAN DEFAULT TRUE,
      next_action VARCHAR(50) DEFAULT 'email_verify',
      retry_count INT DEFAULT 0,
      comment TEXT NULL,
      user_data JSON NULL,
      is_email_verified BOOLEAN DEFAULT FALSE,
      is_mobile_verified BOOLEAN DEFAULT FALSE,
      is_processed BOOLEAN DEFAULT FALSE,
      mobile_number VARCHAR(15),
      mobile_otp VARCHAR(6) NULL,
      role VARCHAR(15) DEFAULT 'user'
    );
  `;

  conn.query(createTableQuery, (error, results) => {
    if (error) {
      console.error('Error creating table:', error);
      return;
    }
    console.log('User Verification Table created');
  });
};

module.exports = { createTable };