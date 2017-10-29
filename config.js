
const dbName = 'whateverdb';

export default {
  'secret': 'whateversecret',
  'database': `mongodb://127.0.0.1:27017/${dbName}`,
  'production-database': proccess.env.MONGODB_URI
}
