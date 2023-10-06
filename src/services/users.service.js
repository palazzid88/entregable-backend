const usersDao = require("../DAO/mongo/classes/users.dao.js");

const { createHash, isValidPassword } = require('../utils/utils.js');

class UserService {
    async findUser (email, password) {
        const user = await usersDao.findOne({ email: email, password: password }, 
            {
                _id: true,
                email: true,
                firstName: true,
                password: true,
                rol: true
            });
            return user || false;
    }

    async findUserByEmail(email) {
        const user = await usersDao.findOne(
            {email: email },
            {
                _id: true,
                email: true,
                firstName: true,
                password: true,
                role: true,
            }
        );
        return user || false;
    }

    async getAll() {
        const users = await usersDao.find(
            {},
            {
              _id: true,
              email: true,
              firstName: true,
              password: true,
              rol: true,
            }
          );
          return users;
        }

    async create(user) {
        user.password = createHash(user.password);
          const existingUser = await this.findUserByEmail(user.email);
        
            if (existingUser) {
              return false;
            }
        
          const userCreated = await usersDao.create(user);
        
        return userCreated;
    }

    async updateOne({ _id, email, firstName, password, rol }) {
        const userUptaded = await UserModel.updateOne(
          {
            _id: _id,
          },
          {
            email,
            firstName,
            password,
            rol,
          }
        );
        return userUptaded;
      }
    
      async deleteOne(_id) {
        const result = await usersDao.deleteOne({ _id: _id });
        return result;
      }
    }

    module.exports = UserService;