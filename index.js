import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './config';
import User from './app/models/user';

const app = express();

const port = process.env.PORT || 8080;

if (process.env.MONGODB_URI) {
  mongoose.connect(config.productionDatabase);
} else {
  mongoose.connect(config.database);
}

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send(`Hello! Running on port ${port}.`);
});

app.post('/authenticate', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        const payload = {
          'somedata': 'somedataaa'
        };

        const token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: '1m'
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

app.post('/users', (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save((err) => {
    if(err) throw err;

    console.log('User saved');
    res.json({ success: true });
  });
});

app.use((req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});

app.listen(port);
console.log('Running...');
