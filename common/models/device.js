/**
 * Created by yotam on 08/11/2016.
 */
module.exports = function (Device) {
  Device.validatesUniquenessOf('registrationId', {message: 'RegistrationId must be unique'});

}
