const exercisesModel = require('./exercise.mongo');
const usersModel = require('../users/user.mongo');

async function createExercise({userID, description, duration, date}) {
  try {
    const user = await usersModel.findOne({
      _id: userID
    });
  
    if (user) {
      const newExercise = new exercisesModel({
        userID,
        description,
        duration,
        date: date? new Date(date) : new Date()
      });
  
      const exerciseCreated = await newExercise.save();
  
      return { 
        _id: user._id, 
        username: user.username,
        description: exerciseCreated.description,
        duration: exerciseCreated.duration,
        date: new Date(exerciseCreated.date).toDateString(),
      };
    } else {
      return;
    }
  } catch (error) {
    console.error(`Could not create exercise: ${error}`);
  }
}

async function getUserExercisesLog(userID, from, to, limit) {
  try {
    const user = await usersModel.findOne({
      _id: userID
    });

    if(user){
      const exercises = await exercisesModel.find({
        userID, 
        date: { $gte: from, $lte: to}
      }, {
        '_id': 0,
        '__v': 0,
        'userID': 0
      }).limit(limit);

      return {
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: exercises.map(
          exercise=> ({
            description: exercise.description, 
            duration: exercise.duration, 
            date: new Date(exercise.date).toDateString()
          }))
      };
    } else {
      return ;
    }
  } catch (error) {
    console.error(`Could not get user logs: ${error}`);
  }
}

module.exports = {
  createExercise,
  getUserExercisesLog
}