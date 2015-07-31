angular.module('starter.controllers', [])

.controller('forgotpassword', function($scope,$http,$state) {
    $scope.forgetpassword={};


    $scope.forgetPassword = function(){
      var email = $scope.forgetpassword.email;
        var req = {
            method: 'POST',
            url: 'http://calorie.textilemarketresearch.com/services/forgotPassword',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: "email="+email+""
        }
        $http(req).success(function(data){
          if(data.status == 1){
            alert(data.message);
             document.getElementById("forgetemail").value = "";
            $state.go('page2', data);
          }
          else{
            alert(data.message);
            document.getElementById("forgetemail").value = "";
          }
        })
        .error(function(){
          alert("No response from Server");
        });
    }                        
})

.controller('signupCtrl', function($http,$scope,$filter,$ionicLoading) {
  $scope.signup = {};
 
    $ionicLoading.show({
      template: "Loading..."
    });
  
  var req = {
      method: 'GET',
      url: 'http://calorie.textilemarketresearch.com/services/getAllCities'
    }
    $http(req).success(function(data){
      //alert(JSON.stringify(data));
      $scope.cities = data;
      $ionicLoading.hide();
    })
    .error(function(){
      alert("No response from Server");
      $ionicLoading.hide();
    });

    CheckTrueFlase = function (data){
        if (data == true){
            return 1;
        } 
        else{
          return 0;
        }

    };

  $scope.CreateUser = function(){

    var fullname = $scope.signup.fullname;
    var dob = $filter('date')($scope.signup.dob,'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
    var gender = $scope.signup.gender;
    var married = $scope.signup.married;
    var drinker = $scope.signup.drinker;
    var hfeet = $scope.signup.heightfeet;
    var hinch = $scope.signup.heightinches;
    var weight = $scope.signup.weight;
    var waist = $scope.signup.waistline;
    var diabetes = CheckTrueFlase($scope.signup.daibetic);
    var hypertension = CheckTrueFlase($scope.signup.hypertensive);
    var kidney = CheckTrueFlase($scope.signup.kidney);
    var smoker = CheckTrueFlase($scope.signup.smoker);
    var teeto = CheckTrueFlase($scope.signup.teeto);
    var mobile = $scope.signup.mobile;
    var email = $scope.signup.email;
    var street1 = $scope.signup.street1;
    var street2 = $scope.signup.street2;
    var city = $scope.signup.city;
    var pin = $scope.signup.pin;
    var drname = $scope.signup.drname;
    var drplace = $scope.signup.drplace;
    var password = $scope.signup.password;
    //alert(JSON.stringify($scope.signup));

    var req = {
        method: 'POST',
        url: 'http://calorie.textilemarketresearch.com/services/saveUsers',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: "mobile="+mobile+"&password="+password+"&name="+fullname+"&dob="+dob+"&gender="+gender+"&married="+married+"&hfeet="+hfeet+"&hinch="+hinch+"&weight="+weight+"&waist="+waist+"&diabetes="+diabetes+"&hypertension="+hypertension+"&kidney="+kidney+"&smoker="+smoker+"&drinker="+drinker+"&teeto="+teeto+"&mobile="+mobile+"&email="+email+"&street1="+street1+"&street2="+street2+"&city_id="+city+"&pin="+pin+"&doctor_name="+drname+"&doctor_place="+drplace+""              
    }
    
    $http(req).success(function(data){
        if(data.status == 1){
          //alert(JSON.stringify(data))
          alert(data.message);
        }
        else{
          alert(data.message);
        }
    })
    
    .error(function(){
      alert("No response from Server");
    });
  } 
})

.controller('loginCtrl', function($scope,$http, $state) {

   // Form data for the login modal
  $scope.loginData = {};
  
  $scope.login = function() {
    var mobile = $scope.loginData.mobile;
    var password =$scope.loginData.password;
    /*var data = $.param({
      json: JSON.stringify({
        name: $scope.newName
      })
    });*/
    
    $http.defaults.useXDomain = true;
    var req = {
      method: 'POST',
      url: 'http://calorie.textilemarketresearch.com/services/loginUser',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: "mobile="+mobile+"&password="+password+""
    }
    $http(req).success(function(data){
      if(data.status == 1){
        alert(JSON.stringify(data));
        $state.go('page4', data);
      }
      else{
        alert("Wrong username/password");
      }
    })
    .error(function(){
      alert("No response from Server");
    });
  } 


});
