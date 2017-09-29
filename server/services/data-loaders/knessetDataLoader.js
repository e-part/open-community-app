/**
 * Created by yotam on 06/09/2016.
 */

// requests examples - get committee agenda between 2 dates.
// http://online.knesset.gov.il/WsinternetSps/KnessetDataService/CommitteeScheduleData.svc/CommitteeAgendaSearch?ToDate=%272016-01-05T00%3A00%3A00%27&CommitteeId=%271%27&FromDate=%272016-01-01T00%3A00%3A00%27

// http://online.knesset.gov.il/WsinternetSps/KnessetDataService/CommitteeScheduleData.svc/View_committee(2) - get committee 2 info
var argv = require('minimist')(process.argv.slice(2));

var request = require('request');
var parser = require('xml2json');
var _ = require('lodash');
var mysql = require('mysql');
var moment = require('moment-timezone');

var committeeSchedule = {
  mappingKey: "CommitteeAgenda",
  responseObjectDataProperty: "CommitteeAgendaSearch",
  metaUrl: "http://online.knesset.gov.il/WsinternetSps/KnessetDataService/CommitteeScheduleData.svc/CommitteeAgendaSearch",
  migrateModel: "Post", // model that will be integrated with the new data.
  primaryKeyField: "officialMeetingId", // key that will hold the external data primary key.
};
var dataMapping = {
  CommitteeAgenda: {
    Committee_Agenda_id: {
      field: "officialMeetingId"
    },
    Committee_Agenda_committee_id: {
      field: "officialCommitteeId"
    },
    Committee_Agenda_canceled : {
      field : "isCancelled"
    },
    committee_agenda_date: {
      field: "endDate",
      custom: function (fieldToFormat) {
        // convert date to UTC
        var offset = moment.tz.zone('Asia/Jerusalem').offset(moment(fieldToFormat).format('x')) / 60;
        var ilLocalDate = moment(fieldToFormat).add(offset, 'hours').format();
        return ilLocalDate.split('+')[0];
      }
    },
    committee_agenda_session_content: {
      field: "officialTitle"
    }
  }
};
/**
 * convert the External Data object into ePart compatible DB record according to the
 * @param objToFormat
 * @param dataModel
 * @param dataMapping
 * @returns {{}}
 */

function query(dataConnector, query) {
  return new Promise(function (resolve, reject) {
    dataConnector.connector.execute(query,[],
      function (err, rows) {
        if (err) {
          console.error("Error:" + JSON.stringify(err));
          reject(err);
        }
        resolve(rows || []);
      });
  });

}

var APIConnector = {
  sendRequest : function(options){
    return new Promise(function(resolve, reject){
      request({method: options.method || 'GET', uri: options.url, qs: options.params || {}}, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error("Error:" + JSON.stringify(error));
          return reject(error);
        } else {
          var content = parser.toJson(body);
          var data = JSON.parse(content);
          return resolve(data);
        }
      });

    });
  }
};

function formatDataObject(objToFormat, dataModel, dataMapping) {
  var formattedObj = {};
  var mapping = dataMapping[dataModel.mappingKey];
  // iterate over the mapping and for each property that exist in the external data object
  // convert it according to the map
  for (var prop in mapping) {
    if (mapping[prop].custom) {
      formattedObj[mapping[prop].field] = mapping[prop].custom(objToFormat[prop].$t);
    } else {
      if (typeof objToFormat[prop] !== 'undefined') {
        formattedObj[mapping[prop].field] = objToFormat[prop].$t;
      } else { // no value to map, put null
        formattedObj[mapping[prop].field] = null;
      }
    }
  }
  return formattedObj;
}

function generateDataStateRequests(formattedDataRecords, dataModel) {
  var requests = [];
  for (var i = 0; i < formattedDataRecords.length; i++) {
    var recordId = formattedDataRecords[i][dataModel.primaryKeyField];
    var queryStr = 'SELECT * FROM ' + dataModel.migrateModel + ' where ' + dataModel.primaryKeyField + '=' + recordId + ';';
    var request;
    (function (recordId, requests) { // self invoking is here to keep the loop's closure values for when the promises return.
      request = new Promise(function (resolve, reject) {
        query(dataConnector, queryStr).then(function (result) {
          if (result.length) {
            resolve({recordId: recordId, exists: true}); // no record exist for the given id
          } else {
            resolve({recordId: recordId, exists: false}); // no record exist for the given id
          }
        }, function (err) {
          reject(err);
        });
      });
      requests.push(request);

    }(recordId, requests));
  }
  return requests;
}

function escapeCharacters(value){
  var value = value.replace(/'/g,"''");
  return value;
}

function createUpdateStmt(dataModel, record, recordId) {
  record.updatedAt = moment().utc().format('YYYY-MM-DD HH:mm:ss');
  var fieldsStr = "";
  for (var key in record) {
    fieldsStr += "`" + key + "`='"+escapeCharacters(record[key]) +"',";
  }
  fieldsStr = fieldsStr.slice(0, -1);
  var queryStr = "UPDATE `" + dataModel.migrateModel + "` SET "+ fieldsStr +" WHERE `" + dataModel.primaryKeyField + "`='" + recordId + "';";
  console.log(queryStr);
  return queryStr
}

function createInsertStmt(dataModel, record) {
  var fieldsStr = "";
  var valuesStr = "";
  record.title = "Default Temporary Title (Migrated from Knesset site)";
  record.subtitle = "Default Temporary Subtitle (Migrated from Knesset site)";
  record.status = "DRAFT";
  record.migrationStatus = "KNESSET_MIGRATED";
  record.createdAt = moment().utc().format('YYYY-MM-DD HH:mm:ss');
  record.updatedAt = moment().utc().format('YYYY-MM-DD HH:mm:ss');
  for (var key in record) {
    fieldsStr += "`" + key + "`,";
    valuesStr += "'" + escapeCharacters(record[key]) + "',";
  }
  fieldsStr = fieldsStr.slice(0, -1);
  valuesStr = valuesStr.slice(0, -1);
  var insertFieldsStr = "(" + fieldsStr + ") VALUES (" + valuesStr + ");"
  var queryStr = "INSERT INTO `" + dataModel.migrateModel + "` " + insertFieldsStr;
  console.log(queryStr);
  return queryStr
}

function generateUpdateDBRequests(dataModel, results, formattedDataRecords) {
  var requests = [];

  // iterate over the results, if the record exists, send an update request,
  // else send an insert request.
  for (var i = 0; i < results.length; i++) {
    var recordWhere = {};
    recordWhere[dataModel.primaryKeyField] = results[i].recordId;
    var newRecord = _.find(formattedDataRecords, recordWhere);
    if (results[i].exists) {
      var queryStr = createUpdateStmt(dataModel, newRecord,results[i].recordId);
      requests.push(query(dataConnector, queryStr));
    } else {
      var queryStr = createInsertStmt(dataModel, newRecord);
      requests.push(query(dataConnector, queryStr));
    }
  }
  return requests;
}
/**
 *  for every record found, check if the primaryKey exists in DB (for example: officialMeetingId)
 *  if exists, update the fields to hold the new records.
 *  if does not exist, insert new record to DB.
 * @param dataModel
 * @param formattedDataRecords
 */
function updateRecords(dataModel, formattedDataRecords) {
  // check if records exist in the DB
  var requests = generateDataStateRequests(formattedDataRecords, dataModel, dataModel.primaryKeyField);
  return Promise.all(requests).then(function (results) {
    console.log("state queries returned.");
    // insert or update the ePart DB.
    var updateRequests = generateUpdateDBRequests(dataModel, results, formattedDataRecords);
    return Promise.all(updateRequests);
  });


}

function getAllCommittees(dataModel){
  return new Promise(function(resolve, reject){
    var url = "http://online.knesset.gov.il/WsinternetSps/KnessetDataService/CommitteeScheduleData.svc/View_committee?%24filter=committee_end_date+eq+null+and+committee_portal_link+ne+null";
    APIConnector.sendRequest({url : url }).then(function(committees){
      var entries = committees.feed.entry;
      var committeesIds =  _.map(entries, function(obj){
        var val = _.get(obj,'content.m:properties.d:committee_id.$t');
        var name = _.get(obj,'content.m:properties.d:committee_name');
        console.log("committeId: " + val);
        console.log("committeData: " + name);
        return val;
      });
      resolve({dataModel: dataModel, committeesIds : committeesIds});
    });
  });
}

function loadCommitteesMeetingsData(result){
  var committeesIds = result.committeesIds;
  var dataModel = result.dataModel;
  var formattedDataRecords = [];
  return new Promise(function(resolve, reject){
    var DAYS_IN_FUTURE = 30;
    var params = { // Set the query to check for updates from current time until DAYS_IN_FUTURE.
      FromDate: "'" + (moment().subtract(1,'days').format()).split("+")[0] +"'",
      ToDate: "'" + (moment().add(DAYS_IN_FUTURE,'days').format()).split("+")[0] +"'"
    };
    var requests = [];
    for (var i = 0; i < committeesIds.length; i++){
      params.CommitteeId = "'" + committeesIds[i] + "'";
      console.log("loading data: "+ dataModel.metaUrl);
      console.log("params: ", JSON.stringify(params));
      var request = APIConnector.sendRequest({url : dataModel.metaUrl, params : params });
      requests.push(request);
    }
    Promise.all(requests).then(function(results){
      function getMeetingsDataForCommittee(dataObj){
        var arr = [];
        var dataResults = dataObj[dataModel.responseObjectDataProperty].element;
        console.log("DATA RETRIEVED FOR COMMITTEE: dataObj[dataModel.responseObjectDataProperty] = " , dataObj[dataModel.responseObjectDataProperty]);
        console.log("DATA RETRIEVED FOR COMMITTEE: dataResults = " + dataResults );

        if (dataResults) {
          console.log("DATA RETRIEVED FOR COMMITTEE: length = " + dataResults.length);

          for (var i = 0; i < dataResults.length; i++) {
            var result = dataResults[i];
            arr.push(formatDataObject(result, dataModel, dataMapping));
          }
        }
        console.log("DATA RETRIEVED FOR COMMITTEE: results = " + JSON.stringify(arr));

        return arr;
      }
      _.each(results, function(obj){

        formattedDataRecords = formattedDataRecords.concat(getMeetingsDataForCommittee(obj));
      });
      console.log("DATA RETRIEVED: length = " + formattedDataRecords.length);
      updateRecords(dataModel, formattedDataRecords).then(function(){
        resolve();
      })
    });
  });

}

function dataLoaded() {
  console.log("Migration process completed. Exiting.");
  return true;
}

var dataConnector;

function migrateData(connector){
  dataConnector = connector;
  var dataModel = committeeSchedule;
  return getAllCommittees(dataModel)
    .then(loadCommitteesMeetingsData)
    .then(dataLoaded);

}

var loader = {
  migrate : migrateData
};

module.exports = loader;
