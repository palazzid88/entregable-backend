const ticketService = require("../../services/tickets.service");

// dtos/auth.dto.js
class RegisterDTO {
    constructor(firstName, lastName, email, age, password) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.age = age;
      this.password = password;
    }
  }

  class userDTO {
    constructor(firstName, lastName, email, role) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.role = role;
    }
  }
  
  class LoginDTO {
    constructor(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  
  module.exports = {
    RegisterDTO,
    LoginDTO,
    userDTO,
  };
  