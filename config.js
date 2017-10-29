
const dbName = 'whateverdb';

export default {
  'secret': 'whateversecret',
  'database': `mongodb://127.0.0.1:27017/${dbName}`,
  'productionDatabase': process.env.MONGODB_URI
}
