export const badRequestErrorHandler = (err, req, res, next) => {
 
  if (err.status === 400) {
    res.status(400).send(err.message);
  } else {
    next(err);
  }
};

export const unAuthorizedHandler = (err, req, res, next) => {
  if (err.name === "TokenExpiredError") {
    res.status(401).send(err.message || "Invalid access token!");
  } else {
    next(err);
  }
};

export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send("Forbidden!");
  } else {
    next(err);
  }
};
export const notFoundErrorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.status === 404) {
    res.status(404).send(err.message || "Error, not found!");
  } else {
    next(err);
  }
};



//error controller function
export const mongoErrorHandlers = (err, req, res, next) => {
  try {
 
    if (err.name === 'ValidationError') return err = handleValidationError(err, res);
    if (err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
    
    next(err)
  } catch (err) {
    res.status(500).send('An unknown error occured.');
  }
}

export const catchAllErrorHandler = (err, req, res, next) => {
  console.log("500", err)
  res.status(500).send("Generic Server Error");
};


const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `An account with that ${field} already exists.`;
  res.status(code).send({ messages: error, fields: field });
}

//handle field formatting, empty fields, and mismatched passwords 
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map(el => el.message);
  let fields = Object.values(err.errors).map(el => el.path);
  let code = 400;

  if (errors.length > 1) {
    const formattedErrors = errors.join(' ');
    res.status(code).send({ messages: formattedErrors, fields: fields });
  } else {
    res.status(code).send({ messages: errors, fields: fields })
  }
}
