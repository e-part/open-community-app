/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.about')
    .controller('AboutCtrl', function ($scope, $location, gettextCatalog, CoreService) {

      var title = gettextCatalog.getString('About ePart');
      CoreService.setMetaTags({
        title: gettextCatalog.getString('About ePart')
      });

      $scope.$on('$viewContentLoaded', function () {
        CoreService.sendGaPageview($location.url(), title);
      });
      var ctrl = this;
      ctrl.teamMembers = [
        {
          title: gettextCatalog.getString('Nir Zohar – Co founder & Chairman'),
          description: gettextCatalog.getString("Nir, the first investor in the company is also chairman of the board, " +
            "and contributes his vast experience in high tech as the president of WIX.com Ltd.<br/>" +
            "Nir has been with Wix since 2007 and he’s been the driving force behind the successful scaling of the company's operations from a small start-up into " +
            "an international company serving tens of millions of users. Nir spearheads all efforts to develop and " +
            "implement Wix' strategic plans geared towards accommodating the company's growth objectives and business goals.<br/> " +
            "On his day off you can catch him reading, spending time with his kids or avidly following the NBA scores."),
          imgSrc: '../images/team/1.jpg',
        },
        {
          title: gettextCatalog.getString('Yossi Hayut – Co founder & CEO'),
          description: gettextCatalog.getString('Yossi is a social entrepreneur and a public interest lawyer. He is the founder and CEO of ePart. <br/>' +
            'Previously, Yossi founded the clinical legal education program that provides pro-bono assistance to Holocaust survivors at Tel Aviv University’s Faculty of Law.' +
            ' He was also an instructor in the Economic Justice clinic, specializing in social business and microfinance loans for women in poverty, also at Tel Aviv University. ' +
            'Yossi was awarded the "Medal of Light" on behalf of the Foundation for the Benefit of Holocaust Victims and President of Israel, ' +
            'for his unique contribution to Holocaust survivors rights and his involvement in writing the Holocaust Survivors National' +
            ' Assistance Program. He holds an M.A. in public leadership from Tel Aviv University and he lives in near the ' +
            'yarkon park with his wife and daughters, Alona and Galia.'),
          imgSrc: '../images/team/2.jpg',
        },
        {
          title: gettextCatalog.getString('Yotam Shalev – Full Stack Developer'),
          description: gettextCatalog.getString('Yotam is the head of our technology team. He joined us a few months ago to help us build our new web platform. ' +
            'Yotam has been a full-stack developer in the last five years, in which he was a team leader in My6sense, a startup in the Ad-Tech industry, and a volunteering developer at Helpi, a startup dedicated to increasing social involvement within the community.' +
            '<br/>Yotam has Bsc in computer science from the Hebrew University of Jerusalem and a Master`s degree in Philosophy from Tel-Aviv University.'),
          imgSrc: '../images/team/5.jpg',
        },
      ];
      ctrl.sections = [
        {
          title : '',
          content : gettextCatalog.getString('<p class="highlighted">ePart is a civic startup which gives you, the citizen, the ability to influence the government on subjects you care about with only one click, from anywhere, anytime. </p>' +
          '<p> ePart makes civic engagement easy and simple – we use technology in order to deepen political participation by enabling citizens to connect continually with their elected representatives - not just once every four years, on election day.</p>')
        }
      ];

    });
})();
