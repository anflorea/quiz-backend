import jwt from 'jsonwebtoken';

export default function(req, res, next, app) {

  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      message: 'No token provided.'
    });
  }
}
