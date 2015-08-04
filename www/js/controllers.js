angular.module('starter.controllers', [])

.service('myservice', function() {
      this.setName = function(data){
              this.name = data.details.name;
              this.id = data.details.id;

      }
    })

.controller('MainController', [ '$scope', function($scope) {
  $scope.toggleMenu = function() {
    $scope.sideMenuController.toggleLeft();
  }
}])  

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

.controller('getCaloriesCtrl', function($filter,$rootScope,$scope,$http, $state, myservice, $ionicLoading,$stateParams) {

   // Form data for the login modal
    var date= $stateParams.date;
    $scope.date = $filter('date')(date,'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
    console.log(date);
    var cd =JSON.parse(window.localStorage.getItem("clientDetails"));
    console.log(cd.id);
    var userid = cd.id;
    $ionicLoading.show({
      template: "Loading..."
    });       
    var req = {
      method: 'GET',
      url: 'http://calorie.textilemarketresearch.com/services/detailCalories?userid='+userid+'&date='+date+''
    }
    $http(req).success(function(data){
        //alert(JSON.stringify(data));
        $scope.caloriesdetails = data ;
        $ionicLoading.hide();
    })
    .error(function(){
      alert("No response from Server");
    }); 
})

.controller('todayscalorieCtrl', function($http, $scope, $filter, $ionicLoading, $state, myservice) {
  
  $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];

  $scope.todayscalorie = {};
  
    
    $scope.myservice = myservice.id;
    var uid = $scope.myservice;
  
  $scope.getDishes = function(){
      var eid = $scope.todayscalorie.event;
      //alert(eid);
      $ionicLoading.show({
      template: "Loading..."
      });

      var req = {
      method: 'GET',
      url: 'http://calorie.textilemarketresearch.com/services/getDishes?cat='+eid+''
      }
      $http(req).success(function(data){
        //alert(JSON.stringify(data));
        $scope.dishes = data;
        $ionicLoading.hide();
      })
      .error(function(){
        alert("No response from Server");
        $ionicLoading.hide();
      });
  }
  
    CheckTrueFlase = function (data){
        if (data == true){
            return 1;
        } 
        else{
          return 0;
        }

    };
    $scope.AddCalorie = function(){
        
    var dt = $filter('date')($scope.todayscalorie.date,'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
    var eid = $scope.todayscalorie.event;
    var did = $scope.todayscalorie.dish;
    //alert(JSON.stringify($scope.todayscalorie));

    var req = {
        method: 'POST',
        url: 'http://calorie.textilemarketresearch.com/services/addCalories',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: "user_id="+uid+"&event_id="+eid+"&date="+dt+"&dish_id="+did+""              
    }
    
    $http(req).success(function(data){
        
          //alert(JSON.stringify(data))
          //alert(data.message);
          alert("Today's Calorie added.")
           $state.go('page4', data);
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

.controller('loginsuccess',
    function ($rootScope, $scope, $http, myservice,$ionicLoading) {
      

      $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];
  

      $ionicLoading.show({
      template: "Loading..."
    });

      $scope.myservice = myservice;
      var uid = $scope.myservice.id;
      //alert(uid);
      $scope.calorielists = {};
      var req = {
      method: 'POST',
      url: ' http://calorie.textilemarketresearch.com/services/listCalories?userid='+uid+''  
    }
    $http(req).success(function(data){
      //alert(JSON.stringify(data));
          $scope.calorielists = data;
          $ionicLoading.hide();
    })
    .error(function(){
      alert("No response from Server");
    });
})

.controller('loginCtrl', function($rootScope,$scope,$http, $state, myservice, $ionicLoading) {

   // Form data for the login modal
  $scope.loginData = {};
  $scope.clientdetails = {};
  
  $scope.login = function() {
    $ionicLoading.show({
      template: "Loading..."
    });    
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
        //alert(JSON.stringify(data));
        //alert(data.details.name);
        var clientDetails = JSON.stringify(data.details);
        $scope.name = data.details.name;
        myservice.setName(data);
        //alert(JSON.stringify($scope.name));
        window.localStorage.setItem("clientDetails",clientDetails);
        $ionicLoading.hide();
        $state.go('main.page4', data);
      }
      else{
        $ionicLoading.hide();
        alert("Wrong username/password");

      }
    })
    .error(function(){
      alert("No response from Server");
    });
  } 
})

// Setup the filter
.filter('checkDish', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(dish) {

    // Ensure that the passed in data is a number
   /* if(isNaN(dish) || dish < 1) {
      // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
      return dish;
    } 
    else {*/
      //console.log(dish);
      // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.
      if(dish == 1) {
        return 'Break Fast';
      } else if(dish == 2) {
        return 'Lunch';
      } else if (dish == 3) {
        return 'Dinner';
//      } 
    }
  }
});
