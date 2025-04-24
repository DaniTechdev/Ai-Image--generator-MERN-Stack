const erroHandler = (err, req, res, next) => {
  console.log(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: err.message });
  }

  //if the error is not created by user

  return res.status(500).json({ error: "Internal server error" });
};

class CustomError extends Error {
  constructor(message, status = 500) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this.name, this.constructor);
  }
}

module.exports = { erroHandler, CustomError };
