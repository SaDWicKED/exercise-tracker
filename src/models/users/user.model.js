const usersModel = require('./user.mongo');

async function createUser(username) {
  try {
    const user = await usersModel.findOne({
      username
    });

    if(!user) {
      const newUser = new usersModel({
        username
      });

      const userCreated = await newUser.save();
      
      return { 
        username: userCreated.username, 
        _id: userCreated._id 
      };
    } else {
      return;
    }
  } catch (error) {
    console.error(`Could not create user: ${error}`);
  }
}

async function getAllUsers() {
  try {
    return await usersModel.find({}, {
      '__v': 0
    });
  } catch (error) {
    console.error(`Could not fetch users: ${error}`);
  }
}


module.exports = {
  createUser,
  getAllUsers
}