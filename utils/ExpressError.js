class ExpressError extends Error {
    constructor(message, statusCode) {
        // To call the constructor of the Error class.
        super();

        this.message = message;

        // Express' built-in error handling middleware function looks for the
        // value of the statusCode variable within the corresponding error
        // object (err.statusCode) to set the value of res.statusCode.
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
