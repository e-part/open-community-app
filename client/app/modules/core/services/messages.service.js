/**
 * Created by yotam on 14/08/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.core')
    .service('MessagesService', function (gettextCatalog) {
      var self = this;
      function _mapFieldErrors(fieldErrorCodes) {
        var clientErrorCodes = []
        for (var i = 0; i < fieldErrorCodes.length; i++) {
          clientErrorCodes.push(self.FIELDS_ERROR_CODES[fieldErrorCodes[i]]);
        }
        return clientErrorCodes;
      }

      this.FIELDS_ERROR_CODES = {
        'default' : 'INVALID_INPUT',
        'uniqueness': 'FIELD_ALREADY_EXISTS',
        'format': 'INVALID_FORMAT'
      };
      this.ERRORS_MAP = {
        "LOGIN_FAILED": gettextCatalog.getString('Login failed, Please try again'),
        "BAD_INPUT": gettextCatalog.getString('Bad input, please verify that the data is correct'),
        "BAD_INPUT_EMAIL": gettextCatalog.getString('Email address is incorrect'),
        "GENERAL_ERROR": gettextCatalog.getString('A general error occurred, please try again'),
        "INTERNAL_ERROR": gettextCatalog.getString('A general error occurred, please try again'),
        "VALIDATION_ERROR": gettextCatalog.getString('Form data is incorrect'),
        "FIELD_ALREADY_EXISTS": gettextCatalog.getString('Field Already Exists'),
        "INVALID_FORMAT": gettextCatalog.getString('Invalid field format'),
        "INVALID_INPUT": gettextCatalog.getString('Invalid field value'),
      };

      this.STATUS_CODES_MAP = {
        "422": {
          code: "VALIDATION_ERROR",
          multipleErrors: true
        }
      };
      /**
       * Maps error code to readable message strings
       * @param codes
       * @returns {*}
       */
      this.mapMessage = function (codes) {
        if (_.isArray(codes)) {
          // todo some errors should support parameters
          // var hello = gettextCatalog.getString("Hello {{name}}!", { name: "Ruben" });
          var translatedErrors = [];
          for (var i = 0; i < codes.length; i++){
            // get the translated text for the given field error
            translatedErrors.push({field : codes[i].field, error : this.ERRORS_MAP[codes[i].errors[0]] ||  this.ERRORS_MAP.INVALID_INPUT });
          }
          return {
            general : this.ERRORS_MAP["VALIDATION_ERROR"],
            fields : translatedErrors
          }

        }
        return {
          general: this.ERRORS_MAP[codes] || this.ERRORS_MAP["GENERAL_ERROR"]
        };
      };
      /**
       * get the error code from a response object.
       * @param response
       */
      this.getResponseError = function (response) {
        if (response.data && response.data.error) {
          if (response.data.error.code) {
            return response.data.error.code;
          }
          if (response.data.error.statusCode) { // handle non-standard error codes.
            var errorCode = this.STATUS_CODES_MAP[response.data.error.statusCode].code;
            var isMultiple = this.STATUS_CODES_MAP[response.data.error.statusCode].multipleErrors
            if (isMultiple) { // handle multiple fields errors
              var errorsArr = [];
              var fieldsErrors = response.data.error.details.codes;
              for (var field in fieldsErrors) {
                errorsArr.push({
                  field: field,
                  errors: _mapFieldErrors(fieldsErrors[field])
                });
              }
              return errorsArr
            }
            return errorCode;
          }
        }
      };

      this.getErrors = function(response){
        var formErrorMsg =  self.mapMessage(self.getResponseError(response));
        if (formErrorMsg.fields){
          formErrorMsg.general = gettextCatalog.getString(formErrorMsg.fields[0].field)
            + " - " + formErrorMsg.fields[0].error;
        }
        return formErrorMsg;
      };

    });

})();
