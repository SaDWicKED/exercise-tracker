const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { createUser, getAllUsers } = require('./models/users/user.model');
const { createExercise, getUserExercisesLog } = require('./models/exercises/exercise.model');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.post('/api/users', async (req, res) => {
  const user = await createUser(req.body.username);
  if(user) {
    return res.status(201).json(user);
  } else {
    return res.status(200).json({
      message: "User already exists"
    });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await getAllUsers();
  return res.status(200).json(users);
});

app.post('/api/users/:id/exercises', async (req, res) => {
  const {description, duration, date} = req.body;
  const exercise = await createExercise({
    userID: req.params.id,
    description,
    duration,
    date
  });
  if(exercise) {
    return res.status(201).json(exercise);
  } else {
    return res.status(200).json({
      message: `There is no user with id: ${req.params.id}`
    });
  }
});

app.get('/api/users/:id/logs', async (req, res) => {
  let {
    from = -8640000000000000, // minimum date value
    to = 8640000000000000, // maximum date value
    limit = 0 
  } = req.query;
  
  const userLog = await getUserExercisesLog(req.params.id, from, to, limit);

  if(userLog) {
    return res.status(200).json(userLog);
  } else {
    return res.status(200).json({
      message: `There is no user with id: ${req.params.id}`
    });
  }
});


module.exports = app;