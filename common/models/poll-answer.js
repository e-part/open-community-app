/**
 * Created by yotam on 25/09/2016.
 */
'use strict';

var rawQueries = require('./../../server/services/mysql-queries-provider');
var errorsProvider = require('./../../server/services/errors-provider');

var status = require('http-status');
var loopback = require('loopback');

module.exports = function (PollAnswer) {

  PollAnswer.remoteMethod('incrementAnswerVotes', {
    accepts: [
      {arg: 'id', type: 'number', required: true}
    ],
    returns: {root: true, type: 'object'},
    http: {
      verb: 'post',
      path: '/:id/incrementVotes'
    }
  });

  PollAnswer.incrementAnswerVotes = function (answerId, cb) {
    var PollVote = PollAnswer.app.models.PollVote;
    var Poll = PollAnswer.app.models.Poll;

    function _getPollByAnswerId(){
      return new Promise(function(resolve, reject) {
        PollAnswer.findById(answerId, function(err, pollAnswer) {
          if (err){
            console.error(err);
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
          }
          if (!pollAnswer){
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.BAD_INPUT_ITEM_NOT_FOUND));
          }
          _pollId = pollAnswer.pollId;
          resolve();
        });
      });

    }
    function _testIfUserHasVotedForPoll(){
      return new Promise(function(resolve, reject) {
        PollVote.find({where : {pollId : _pollId, userId : _userId}}, function(err, votes) {
          if (err){
            console.error(err);
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
          }
          if (votes.length > 0){ // user has already voted
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.BAD_INPUT_ALREADY_VOTED_FOR_POLL));
          }
          resolve();
        });
      });
    }
    function _incrementAnswerVotes(){
      return new Promise(function(resolve, reject) {
        var ds = PollAnswer.app.dataSources.db;
        ds.connector.execute(rawQueries.incrementPollAnswerVotes, [answerId], function (err, data) {
          if (err) {
            console.error(err);
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR), null);
          }
          if (!data.affectedRows){
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.BAD_INPUT_ITEM_NOT_FOUND), null);
          }
          resolve();
        });
      });
    }
    function _saveVoteInHistory(){
      return new Promise(function(resolve, reject) {
        PollVote.create({pollId : _pollId, userId : _userId}, function (err, results) {
          if (err) {
            console.error('Error : Failed to save vote to history ', err);
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
          }
          resolve();
        });
      });
    }
    function _voteCompleted(){
      return new Promise(function(resolve, reject) {
        Poll.findById(_pollId, {include : ['answers']}, function (err, poll) {
          if (err) {
            console.error('Error : Failed to retreive the updated poll: ', err);
            return cb(errorsProvider.generateError(errorsProvider.errorsMap.INTERNAL_ERROR));
          }
          cb(null,poll )
        });
      });
    }

    var lbCtx = require('loopback-context').getCurrentContext();
    var currentUser = lbCtx && lbCtx.get('currentUser');
    if (!currentUser){ // test if user session exists.
      cb(errorsProvider.generateError(errorsProvider.errorsMap.AUTHORIZATION_REQUIRED));
    }
    var _userId = currentUser.id;
    var _pollId;

    _getPollByAnswerId()
      .then(_testIfUserHasVotedForPoll) // test if user has already voted on this poll
      .then(_incrementAnswerVotes) // increment votes counter
      .then(_saveVoteInHistory) // save the vote to history.
      .then(_voteCompleted); // get the current poll results after the update occured.
  };

};
