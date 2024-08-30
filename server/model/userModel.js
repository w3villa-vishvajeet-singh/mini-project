const conn = require('../config/dbConnection');


const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255),
      unique_reference_id VARCHAR(255) UNIQUE NOT NULL ,
      next_action varchar(50) default 'mobile_verify',
      verification_hash varchar(255) NULL,
      email VARCHAR(255) ,
      password VARCHAR(255),
      mobile_number varchar(15),
      google_id varchar(255) default null,
      github_id varchar(255) default null,
      profile_image_url text default null,
      address varchar(255),
      tier ENUM('free', 'silver', 'gold') DEFAULT 'free',
      is_mobile_verified boolean  default false,
      is_social_signup  boolean default false
    );
  `;

  conn.query(createTableQuery, (error, results) => {
    if (error) {
      console.error('Error creating table:', error);
      return;
    }
    console.log(' User Table created');
  });
};



// Export the functions
module.exports = { createTable };