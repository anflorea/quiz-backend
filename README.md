# Quiz-shm Back-end


## Development

### MacOS

Requires [Node.js](http://hodejs.orj/) with NPM.
Requires [Mongodb](https://www.mongodb.com/) - Run `brew install mongodb`.

* Clone project
* Install nodemon globally: `npm install -g nodemon` (only first time)
* run `brew services start mongodb` to start a local db
* run `npm install`
* Run `npm run dev` (or `npm start` if you want to run without nodemon)
* to add an ADMIN from cli:
```
db.users.insert({
  createdAt: ISODate("2017-11-06T20:13:34.344Z"),
  updatedAt: ISODate("2017-11-06T20:13:34.344Z"),
  username: 'test',
  email: 'test@example.com',
  password: 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=',
  firstName: 'John',
  lastName: 'Doe',
  role: 'ADMIN'
})
```
(The unhashed password is `12345`)

### Windows

* Figure out if needed :)
