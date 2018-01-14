import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './config';
import User from './app/models/user';
import Controllers from './app/controllers';
import crypto from 'crypto';

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

app.use('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-access-token');
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }
  next();
 });

app.post('/sign_in', (req, res, next) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      res.status(401).json({message: "An error occured."});
      return;
    }

    if (!user) {
      res.status(401).json({'message': 'Authentication failed. Bad username/password.'});
    } else {
      let hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
      if (user.password != hash) {
        res.status(401).json({'message': 'Authentication failed. Bad username/password.'});
      } else {
        const payload = {
          'role': user.role,
          'currentUser': user.username
        };

        const token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: '1 day'
        });

        res.json({
          message: 'Authentication successful!',
          token: token
        });
      }
    }
  });
});

app.use((req, res, next) => {
  routeMiddleware(req, res, next, app);
});

app.post('/logout', (req, res, next) => {
  res.json({ 'message': 'Successfuly logged out!'});
});

app.use(Controllers);

// catch 404 and forward to error handler
app.use((req, res, next) => {

    let err = new Error('Requested resource not found.');
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
    res.json({ message: err.message });
});

app.listen(port);
console.log('Running...');

