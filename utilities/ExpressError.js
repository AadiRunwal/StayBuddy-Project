// to handle asynchronous errors separately with different Status codes and Messages.

class ExpressError extends Error{
    constructor(statusCode , message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;