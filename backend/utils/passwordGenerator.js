exports.generatePassword = () => {
  return Math.random().toString(36).slice(-8); // simple random password
};
