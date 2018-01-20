import jwt from 'jsonwebtoken';

export default function(req) {
  const token = req.headers['x-access-token'];
  var decoded = jwt.decode(token, {complete: true});
  return decoded;
}