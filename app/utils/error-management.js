export default function(err) {
  var error = {};
  switch (err.name) {
    case 'ValidationError':
      error.message = err._message;
      error.errors = {};
      for (var field in err.errors) {
        error.errors[field] = err.errors[field].message;
      }
      break;
    case 'MongoError':
      error.message = err.message;
      break;
    default:
      error.message = "An error has occured.";
      break;
  }
  return error;
}