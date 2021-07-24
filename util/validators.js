//Contains functions that validate User input in cases of Login and Input
// 1. validateRegisterInput
// 2. validateLogin Input

// 1. validateRegisterInput
module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  // empty object to hold errors
  const errors = {};

  // check if username is provided (else add error)
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  // check if email provided (else add error)
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } 
  // check to see if email is correct format (with regex)
    else  {
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      // add error if email is not valid format
      if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
      }
  }

  //check if password provided && password and confirmPassword match (else add error)
  if (password === '') {
    errors.password = 'Password must not empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  // return errors and valid (true if no errors)
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateLoginInput = (username, password) => {
  // empty object to hold errors
  const errors = {};

  // check if username provided (else add error)
  if (username.trim() === '') {
      errors.username = 'Username must not be empty';
  }

  //check if password provided (else add error)
  if (password.trim() === '') {
      errors.password = 'Password must not be empty';
  }
  
  // return errors and valid (true if no errors)
  return {
      errors,
      valid: Object.keys(errors).length < 1
    };
}