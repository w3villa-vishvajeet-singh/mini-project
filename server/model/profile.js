// Create a file named createTable.js or similar

const conn = require('../config/dbConnection');

const createTable = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        age INT,
        location VARCHAR(255),
        gender VARCHAR(50),
        occupation VARCHAR(255)
      );
    `;

    conn.query(createTableQuery, (error, results) => {
        if (error) {
            console.error('Error creating table:', error);
            return;
        }
        console.log('Profiles Table created');
    });
};

module.exports = { createTable };
