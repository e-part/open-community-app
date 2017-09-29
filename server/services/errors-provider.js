/**
 * Created by yotam on 13/09/2016.
 */

var ErrorsProvider = {

  errorsMap : {
    AUTHORIZATION_REQUIRED : {
      status : 401,
      message : 'Authorization Required',
      code : 'AUTHORIZATION_REQUIRED'
    },
    BAD_INPUT : {
      status : 400,
      message : 'Bad Input',
      code : 'BAD_INPUT'
    },
    BAD_INPUT_ITEM_NOT_FOUND : {
      status : 404,
      message : 'Bad Input: ID not found',
      code : 'BAD_INPUT_ITEM_NOT_FOUND'
    },
    BAD_INPUT_ITEM_NOT_FOUND_NO_UPVOTE_FOR_COMMENT : {
      status : 400,
      message : 'Bad Input: No upvotes found for current user on the given comment ID.',
      code : 'BAD_INPUT_ITEM_NOT_FOUND_NO_UPVOTE_FOR_COMMENT'
    },
    BAD_INPUT_ALREADY_VOTED_FOR_POLL : {
      status : 400,
      message : 'Bad Input: User has already voted for this poll',
      code : 'BAD_INPUT_ALREADY_VOTED_FOR_POLL'
    },
    FORBIDDEN : {
      status : 403,
      message : 'Access to this item is forbidden',
      code : 'FORBIDDEN'
    },
    INTERNAL_ERROR : {
      status : 500,
      message : 'Internal Server Error',
      code : 'INTERNAL_ERROR'
    },
    
  },
  generateError : function(err){
    var error = new Error();
    error.status = err.status;
    error.message = err.message;
    error.code = err.code;
    return error;
  }
};

module.exports = ErrorsProvider;
