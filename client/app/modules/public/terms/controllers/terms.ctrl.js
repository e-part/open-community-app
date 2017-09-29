/**
 * Created by yotam on 27/06/2016.
 */
(function () {
  'use strict';
  angular
    .module('com.module.terms')
    .controller('TermsCtrl', function ($scope, $location, gettextCatalog, CoreService) {
      var ctrl = this;
      var title = gettextCatalog.getString('ePart - Terms and Privacy Policy');

      CoreService.setMetaTags({
        title: title
      });

      $scope.$on('$viewContentLoaded', function(){
        CoreService.sendGaPageview($location.url(), title);
      });
      ctrl.termsText = gettextCatalog.getString('<h2>Terms of Use (&quot;Terms&quot;) </h2>' +
        '<p><span>Please read these Terms of Use (&quot;Terms&quot;, &quot;Terms of Use&quot;) carefully before using the https://beta.epart.co.il/website (the &quot;Service&quot;) operated by AVSHA, Inc. (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;). </span></p>' +
        '<p ><span>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</span></p>' +
        '<p ><span>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. </span></p>' +
        '<p><span ></span></p>' +
        '<h2>Termination</span><span>&nbsp;</h2>' +
        '<p ><span>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</span></p>' +
        '<p ><span>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</span></p>' +
        '<h2 >Links To Other Web Sites</h2>' +
        '<p ><span>Our Service may contain links to thirdparty web sites or services that are not owned or controlled by ePart.</span></p>' +
        '<p ><span>ePart has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that My Company, Inc. (change this) shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</span></p>' +
        '<p ><span>&nbsp;We strongly advise you to read the terms and conditions and privacy policies of any thirdparty web sites or services that you visit. </span></p>' +
        '<h2 >Governing Law</h2>' +
        '<p ><span>These Terms shall be governed and construed in accordance with the laws of Israel, without regard to its conflict of law provisions.</span></p>' +
        '<p ><span>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</span></p>' +
        '<h2>Changes </h2>' +
        '<p ><span>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 &nbsp;days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</span></p>' +
        '<p ><span>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service. </span></p>' +
        '<h2 >Contact Us</span><span>&nbsp;</h2>' +
        '<p ><span>If you have any questions about these Terms, please contact us.</span></p>');
    });
})();
