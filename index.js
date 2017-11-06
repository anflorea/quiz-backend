import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './config';
import User from './app/models/user';
import Controllers from './app/controllers'

import routeMiddleware from './app/utils/route-middleware';

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

app.post('/sign_in', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(400).json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      if (user.password != req.body.password) {
        res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        const payload = {
          'somedata': 'somedataaa'
        };

        const token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: '1 day'
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

app.use((req, res, next, app) => {
  routeMiddleware(req, res, next, app);
});

app.use(Controllers);

// catch 404 and forward to error handler
app.use((req, res, next) => {

    let err = new Error('Requested resource not found');
    err.code = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {

    if (err.name === 'UnauthorizedError') {
        err.code = 401;
        err.message = 'Invalid authorization token';
    }

    res.status(err.code || 500);
    res.json({ code: err.code || 500, message: err.message });
});

app.listen(port);
console.log('Running...');

