const validateProfile = (req, res, next) => {
    const { name, age, location, gender, occupation } = req.body;
    
    if (!name || !age || !location || !gender || !occupation) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    if (isNaN(age) || age < 0 || age > 150) {
      return res.status(400).json({ error: 'Invalid age' });
    }
  
    // Add more validation as needed
  
    next();
  };
  
  module.exports = { validateProfile };