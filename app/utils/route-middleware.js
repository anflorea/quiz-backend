import jwt from 'jsonwebtoken';

export default function(req, res, next, app) {
  console.log(req.headers)

  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        console.log(err)
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        console.log('wrks')
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
}
