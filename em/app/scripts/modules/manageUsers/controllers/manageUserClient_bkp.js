'use strict';
/**
 * Created by ravikant on 20/6/14.
 */
educationMediaApp.controller('manage_user', function ($scope, $http,iconClassMapping,appUtils) {

    $scope.counter=0;
		$scope.steps = ['one', 'two', 'three', 'four', 'five'];
    $scope.step = 0;
    $scope.wizard = { tacos: 2 };

    $('.datepicker').datepicker(
        {format: 'dd/mm/yyyy',
            language: 'en',
            autoclose: true,
            weekStart: 0,
            todayHighlight:true
        });

    $scope.openDateofBirth=function(){
        $('#dob').focus();
    };

    $scope.userDataTest=[
        {
            "accountInfo":"put account info fields here"
        },
        {
            "personalInfo":"put personal info fields here"
        },
        {
            "contactInfo":"put contact info fields here"
        },
        {
            "otherInfo":"put acc info fields here"
        },
        {
            "finalizeInfo":"put finalize info fields here"
        }
    ];

    $scope.user = {
        "DOB":"",
        "updatedAt":"",
        "middleName":"",
        "regID":"",
        "lastName":"",
        "firstName":"",
        "resetPasswordCodeUntil":"",
        "createdAt":"",
        "resetPasswordCode":"",
        "userType":"",
        "userName":"",
        "contactUserId":"",
        "casteId":"",
        "birthPlace_country":"",
        "birthPlace_state":"",
        "birthPlace_city":"",
        "visaDetails":"",
        "isSMSEnabled":"",
        "isFromReservedCategory":"",
        "passportNumber":"",
        "sex":"",
        "softeDelete":"",
        "languages_others":"",
        "profileImagePath":"",
        "languages_motherTongue":"",
        "createdBy":"",
        "uid":"",
        "religionId":"",
        "isEconomicallyBackward":"",
        "updatedBy":"",
        "isPhysicallyHandicapped":"",
        "hashPassword":"",
        "panNum":"",
        "accessList":"",
        "isEmailEnabled":""
    };

    $scope.primaryAddress = {
        "city":"",
        "state":"",
        "street1":"",
        "country":"",
        "street2":"",
        "district":"",
        "pincode":""
    }

    $scope.secondaryAddress ={
        "city":"",
        "state":"",
        "street1":"",
        "country":"",
        "street2":"",
        "district":"",
        "pincode":""
    }

    $scope.socialNetwork ={
        "twitterId":"",
        "twitterUrl":"",
        "facebookId":"",
        "facebookScreenName":"",
        "skypeUrl":"",
        "skypeId":"",
        "facebookUrl":""
    }

    $scope.contact = {
        "emailPrimary":"",
        "emailSecondary":"",
        "phonePrimary":"",
        "phoneSecondary":""
    }

	$scope.next=function(){
        $scope.counter>=($scope.userDataTest.length-1)?$scope.userDataTest.length:$scope.counter++;
        console.log("Puneet "+$scope.step+" userDataLength "+$scope.userDataTest.length);
        $scope.step=$scope.counter;

    }
     $scope.prev=function(){
        $scope.counter<=0?0:$scope.counter--;
        $scope.step=$scope.counter;
    }

  $scope.isFirstStep = function() {
      console.log("isFirstStep ");
    return $scope.step === 0;
  };

  $scope.isLastStep = function() {
      console.log("isLastStep ");
    return $scope.step === ($scope.steps.length - 1);
  };
  
  $scope.isCurrentStep = function(step) {
      console.log("isCurrentStep");
    return $scope.step === step;
  };

  $scope.setCurrentStep = function(step) {
      console.log("setCurrentStep");
    $scope.step = step;
  };

  $scope.getCurrentStep = function() {
      console.log("getCurrentStep");
    return $scope.steps[$scope.step];
  };

  $scope.getNextLabel = function() {
      console.log("getNextLabel");
    return ($scope.isLastStep()) ? 'Submit' : 'Next'; 
  };

  $scope.handlePrevious = function() {
      console.log("handlePrevious");
    $scope.step -= ($scope.isFirstStep()) ? 0 : 1;
  };

  $scope.handleNext = function(dismiss) {
      console.log("handleNext");
    if($scope.isLastStep()) {
      dismiss();
    } else {
      $scope.step += 1;
    }
  };
});