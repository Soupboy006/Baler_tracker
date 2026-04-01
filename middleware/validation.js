// Validation helper functions
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (password) => {
  // At least 8 characters, contains at least one number and one letter
  return /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/.test(password);
};

const validatePhone = (phone) => {
  // Simple phone validation
  return /^\+?[0-9]{10,15}$/.test(phone);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone
};