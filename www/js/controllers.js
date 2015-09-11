angular.module('starter.controllers', [])

.run(function($rootScope,$state,$ionicHistory,$ionicPlatform,$ionicLoading) {
      var tags = new Array();
      $rootScope.hitme = function(){
        
        //var tags = [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ];

        $( ".autocomplete" ).autocomplete({
              source: function( request, response ) {
                var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( tags, function( item ){
                  return matcher.test( item );
                }) );
              }
            }); 
      } 

 $ionicLoading.show({
      template: "Loading..."
    });

$.ajax({
    url: 'http://calorie.textilemarketresearch.com/services/getAllCities',
    type: 'POST',
    success: function (response) {
      //alert(JSON.stringify(response)); 
      $rootScope.cities = response;
      //console.log($rootScope.cities);
     $.each(response ,function(index,value){
        tags.push(value.city_name);  
      });
      $ionicLoading.hide();   
      //tags = response;
      //alert(tags);

        },
        error: function () {
          $ionicLoading.hide();
        }
  });


      $rootScope.appLaunch = function (){

           window.localStorage.setItem("applaunch",1);
           if (window.localStorage.getItem("clientDetails") == null ){
              $rootScope.goToState('page1');
           } 
           else{
              $rootScope.goToState('main.page4');
           }
           
      } 
      $rootScope.myGoBack  = function() {
        $ionicHistory.goBack();
      }
      $rootScope.logOut = function() {
        var txt;
        var r = confirm("Are you sure you want to logout?");
        if (r == true) {
            //console.log("You pressed OK!");
            window.localStorage.removeItem("clientDetails");    
        } else {
            //console.log("You pressed cancel!");
        }
      };

      $rootScope.goToState = function (statename) {
        $state.go(''+statename+'');
      }
})

.service('myservice', function() {
      this.setName = function(data){
              this.name = data.details.name;
              this.id = data.details.id;

      }
})

.controller('MainController', [ '$scope', function($scope) {
  $scope.toggleMenu = function() {
    $scope.sideMenuController.toggleLeft();
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  
}])  

.controller('changepasswordCtrl', function($scope,$http,$state) {
    $scope.changepassword={}
    var clientdetails = JSON.parse(window.localStorage.getItem("clientDetails"));
    $scope.changepassword.email = clientdetails.email.trim();
    $scope.changePassword = function(){

      var email = clientdetails.email.trim();
      var password =$scope.changepassword.oldPass;
      var newpassword = $scope.changepassword.newPass;

      console.log(email + " " + password +' '+ newpassword);  

      if( password == null || newpassword == null){
          alert("Password or new password cannot be null");
          return ;
      }
      else if (password == "" || newpassword == ""){
          alert("Password or new password cannot be null");
          return ;
      }
      else if ( password == newpassword ){
          alert("Old Password and New Password cannot be same,Please enter different password");
          return;
      }
      else{
        var req = {
            method: 'POST',
            url: 'http://calorie.textilemarketresearch.com/services/changePassword',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: "email="+email+"&password="+password+"&newpassword="+newpassword+"" 
            //data:"email=anuj1@gmail.com&password=lola&newpassword=loli"
        }
        $http(req).success(function(data){
          if(data.status == 1){
            alert(data.message);
             document.getElementById("changeoldpass").value = "";
             document.getElementById("changenewpass").value = "";
             $scope.changepassword.oldPass = "";
             $scope.changepassword.newPass = "";
             //$state.go('main.page4', data);
          }
          else{
            alert(data.message);
            document.getElementById("changeoldpass").value = "";
            document.getElementById("changenewpass").value = "";
            $scope.changepassword.oldPass = "";
            $scope.changepassword.newPass = "";
          }
        })
        .error(function(){
          alert("No response from Server");
        });
      }
    }                        
}) 

.controller('forgotpassword', function($scope,$http,$state) {
    $scope.forgetpassword={};


    $scope.forgetPassword = function(){
      var email = $scope.forgetpassword.email;

      if(email == null){
        alert("Email id cant be blank.")
        return;
      }
      else{ 
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
          alert("Email id is not valid");
          return;
        }

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
    }                        
})

.controller('getCaloriesCtrl', function($filter,$rootScope,$scope,$http, $state, myservice, $ionicLoading,$stateParams,$ionicHistory) {
$scope.myGoBack  = function() {
    $ionicHistory.goBack();
  };
   // Form data for the login modal
    //var strdate = $stateParams.date.replace(/\ /g,"T");
    var d = new Date($stateParams.date);
    console.log(d);
    $scope.date =d; 
    var date= $stateParams.date;  
    console.log(date);
    var cd =JSON.parse(window.localStorage.getItem("clientDetails"));
    console.log(cd.id);
    var userid = cd.id;
    $scope.user = cd.name;
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
        console.log(data);
        var tmp = 0;
        var len = 0;
          for (var o in data) {
              len++;
          }
          for (var i = 0; i < len; i++) {
              var totalcalsum = parseInt(data[i]['calories']) * parseInt(data[i]['qty']);
              tmp = tmp + totalcalsum;
            }
            $scope.totalcalories = tmp;
            console.log(tmp);
        $ionicLoading.hide();
    })
    .error(function(){
      alert("No response from Server");
    }); 
})

 .controller('todayscalorieCtrl', function($compile,$http,$scope,$filter,$ionicLoading,$ionicSideMenuDelegate,$ionicHistory,$state,myservice) {
  $scope.count = 0;
  var ctr = 1;
   $scope.myGoBack  = function() {
    $ionicHistory.goBack();
  };
  $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];
$scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.todayscalorie = {};
  
    
    $scope.myservice = myservice.id;
    var uid = $scope.myservice;
  
  /*$scope.getDishes = function(){                  
      var eid = $scope.todayscalorie.event[0];
      //var eid=1;
      alert("Scope count :: "+$scope.count);
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
        console.log("Data coming : "+JSON.stringify(data));
        console.log("Dishes :: "+JSON.stringify($scope.dishes));
        $ionicLoading.hide();
      })
      .error(function(){
        alert("No response from Server");
        $ionicLoading.hide();
      });
  }*/

$scope.dishes = new Array();
  /*$scope.getDishes = function(counter){                              
      //var eid = $scope.todayscalorie.event[0];      
      var eid = counter;
      //var eid=1;      
      $ionicLoading.show({
      template: "Loading..."
      });

      var req = {
      method: 'GET',
      url: 'http://calorie.textilemarketresearch.com/services/getDishes?cat='+eid+''
      }
      $http(req).success(function(data){
        //alert(JSON.stringify(data));                
        $scope.dishes[ctr] = data;
        console.log("Data :: "+data);        
        console.log("Dishes [0] :: "+JSON.stringify($scope.dishes[0]));
        $ionicLoading.hide();
        ctr++;
      })
      .error(function(){
        alert("No response from Server");
        $ionicLoading.hide();
      });
  }*/

  var dishCtr = 0;
    $scope.testClick = function(e){
      //alert($(e.target).attr("id"));
      $("#iid").val($(e.target).attr("id"));
      dishCtr = $(e.target).attr("id");
      console.log("dishctr"+dishCtr);
    }

  $scope.getDishes = function(counter){                              
      var eid = $scope.todayscalorie.event[0];      
      //var eid = counter;
      //var eid=1;   
      console.log("eid"+eid);   
      $ionicLoading.show({
      template: "Loading..."
      });

      var req = {
      method: 'GET',
      url: 'http://calorie.textilemarketresearch.com/services/getDishes?cat='+eid+''
      }
      var ctr1 = dishCtr;
      $http(req).success(function(data){
        //alert(JSON.stringify(data));                        
        $scope.dishes[ctr1] = data;        
        $ionicLoading.hide();
        ctr1++;
        ctr=ctr+2;
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
    var obj = $scope.todayscalorie;        
    //alert(ctr);
    
    var clientDetails = JSON.parse(window.localStorage.getItem("clientDetails"));
    var dff= new Date();
    var dt = $filter('date')(dff,'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
    var eid = $scope.todayscalorie.event;
    var did = $scope.todayscalorie.dish;
    var qid = $scope.todayscalorie.quantity;
    var uid = clientDetails.id;    

/*Parameters : cal = [{"id":"0","user_id": "31","event_time": "2","cdate": "2015-07-27" , "dish_id":"2", "qty" : "2"    },     {       "id":"0",  "user_id": "31",         "event_time": "2",         "cdate": "2015-07-27" , "dish_id":"2", "qty" : "2"        },     {         "id":"0",   "user_id": "31",         "event_time": "2",         "cdate": "2015-07-27" , "dish_id":"2", "qty" : "2"       } ]*/

      var i = 0;    
      var formData="[";      
     for(i=0;i<ctr;i++){
        var event1 = $scope.todayscalorie.event[0];
        var dish = $scope.todayscalorie.dish[i];
        var qty = $scope.todayscalorie.quantity[i];
        console.log("Counter ::"+ctr);
        console.log(event1+" , "+dish+" , "+qty);
        if(i==(ctr-1)){
          var tmpData = '{"id" : "0","user_id" : "'+uid+'","event_time" : "'+event1+'","cdate" : "'+dt+'","dish_id" : "'+dish+'","qty" : "'+qty+'"}'; 
        }else{
          var tmpData = '{"id" : "0","user_id" : "'+uid+'","event_time" : "'+event1+'","cdate" : "'+dt+'","dish_id" : "'+dish+'","qty" : "'+qty+'"},';
        }
       
       formData = formData + tmpData;
     }
     formData = formData + "]";
     console.log(formData);
    //alert(JSON.stringify($scope.todayscalorie));    
    if(dt == null){
      alert("Please select date, it can't be blank.");
    }else if(eid == null){
      alert("Please select event, it can't be blank.");
    }else if(did == null){
      alert("Please select dish, it can't be blank.");
    }else if(qid == null){
      alert("Please select quantity, it can't be blank.")
    }
    else{
      /*console.log("UID : "+uid);
      console.log("QID : "+qid);
      alert($scope.todayscalorie.dish.length);*/
      var req = {
        method: 'POST',
        url: 'http://calorie.textilemarketresearch.com/services/addCaloriesm',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        /*data: "user_id="+uid+"&event_id="+eid+"&date="+dt+"&dish_id="+did+"&qty="+qid+""              */
        data: "cal=" + formData              
      }
    
      $http(req).success(function(data){
         // alert(JSON.stringify(data));
          //alert(data.message);
          $ionicHistory.clearCache(['main.page6']);
          alert("Today's Calorie added.");
          $state.go('main.page4', data);
      })
      .error(function(){
        alert("No response from Server");
      });
    }
  }  
})

.controller('signupCtrl', function($http,$scope,$state,$filter,$ionicLoading,$rootScope) {
  $scope.signup = {};
 
    /*$ionicLoading.show({
      template: "Loading..."
    });*/

  /*var req = {
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
*/
    getCityId = function (city){

        var len = 0;
        for (var o in $scope.cities) {
              len++;
          }

          for (var i = 0; i < len; i++) {
            if (city == $scope.cities[i].city_name){
                  console.log("Matched :" + $scope.cities[i].city_id ); 
                  return $scope.cities[i].city_id;             
            }
        }
    }

    CheckTrueFlase = function (data){
        if (data == true){
            return 1;
        } 
        else{
          return 0;
        }

    };

  $scope.CreateUser = function(){

    $ionicLoading.show({
      template: "Loading..."
    });

    var fullname = $scope.signup.fullname;
    var dob = $filter('date')($scope.signup.dob,'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
    var gender = $scope.signup.gender;
    var married = $scope.signup.married;
    var drinker = $scope.signup.drinker;
    var hfeet = $scope.signup.heightfeet;
    var hinch = $scope.signup.heightinches;
    var weight = $scope.signup.weight;
    var waist = $scope.signup.waistline;
    var diabetes = $scope.signup.daibetic;
    var hypertension = $scope.signup.hypertensive;
    var kidney = $scope.signup.kidney;
    var smoker = $scope.signup.smoker;
    var teeto = 0;
    var mobile = $scope.signup.mobile;
    var email = $scope.signup.email;
    var street1 = $scope.signup.street1;
    var street2 = $scope.signup.street2;
    var city = getCityId($("#cityName").val()); 
    //console.log(city);
    var pin = $scope.signup.pin;
    var drname = $scope.signup.drname;
    var drplace = $("#drPlace").val();
    //console.log(drplace);
    var password = $scope.signup.password;
    var cpassword = $scope.signup.cpassword;
    console.log(JSON.stringify($scope.signup));

    if(fullname == null){
      alert("Please enter Name, it can't be blank");$ionicLoading.hide();
    }else if(dob == null){
      alert("Please enter Birthdate, it can't be blank");$ionicLoading.hide();
    }else if(gender == null){
      alert("Please specify your Gender");$ionicLoading.hide();
    }else if(married == null){
      alert("Please select your Marital Status.");$ionicLoading.hide();
    }else if(drinker == null){
      alert("Please select your Drink Status");$ionicLoading.hide();
    }else if(hfeet == null){
      alert("Please enter your Height in Feet, it can't be blank");$ionicLoading.hide();
    }else if(hinch == null){
      alert("Please enter your Height in Inch, it can't be blank");$ionicLoading.hide();
    }else if(weight == null){
      alert("Please enter your Weight, it can't be blank");
      $ionicLoading.hide();
    }else if(waist == null){
      alert("Please enter your Waist, it can't be blank");
      $ionicLoading.hide();
    }else if(mobile == null){
      alert("Please enter Mobile Number, it can't be blank");
      $ionicLoading.hide();
    }else if(email == null){
      alert("Please enter Email, it can't be blank");
      $ionicLoading.hide();
    }else if(street1 == null){
      alert("Please enter your Street name, it can't be blank");
      $ionicLoading.hide();
    }else if(city == null){
      alert("Please select your city");
      $ionicLoading.hide();
    }else if(pin == null){
      alert("Please enter your Pin, it can't be blank");
      $ionicLoading.hide();
    }else if(drname == null){
      alert("Please enter your Doctor Name, it can't be blank");
      $ionicLoading.hide();
    }else if(drplace == null){
      alert("Please enter your Doctor Place, it can't be blank");
      $ionicLoading.hide();
    }else if(password == null){
      alert("Please enter your Password, it can't be blank");
      $ionicLoading.hide();
    }else if(cpassword == null){
      alert("Please enter your Confirm Password, it can't be blank.");
      $ionicLoading.hide();
    }
    else{
      if(mobile.toString().length != 10){
        alert("Mobile must be 10 digits.");
        $ionicLoading.hide();
      }
      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
          alert("Email id is not valid");
          $ionicLoading.hide();
      }
      if(pin.toString().length != 6){
        alert("Pincode must be 6 digits.");
        $ionicLoading.hide();
      }
      if(cpassword != password){
        alert("Password did not match.");
        $ionicLoading.hide();
      }
    
      var req = {
        method: 'POST',
        url: 'http://calorie.textilemarketresearch.com/services/saveUsers',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: "mobile="+mobile+"&password="+password+"&name="+fullname+"&dob="+dob+"&gender="+gender+"&married="+married+"&hfeet="+hfeet+"&hinch="+hinch+"&weight="+weight+"&waist="+waist+"&diabetes="+diabetes+"&hypertension="+hypertension+"&kidney="+kidney+"&smoker="+smoker+"&drinker="+drinker+"&teeto="+teeto+"&mobile="+mobile+"&email="+email+"&street1="+street1+"&street2="+street2+"&city_id="+city+"&pin="+pin+"&doctor_name="+drname+"&doctor_place="+drplace+""              
      }
    
      $http(req).success(function(data){
         console.log(JSON.stringify(data));
        if(data.status == 1){
          console.log(JSON.stringify(data));
          alert(data.message);
          $ionicLoading.hide();
          $state.go('page2');
        }else{
          alert(data.message);
          console.log("Error occured :" + data.message);
          $ionicLoading.hide();
        }
      })    
      .error(function(){
        alert("No response from Server");
        $ionicLoading.hide();
      });
    }
  } 
})

.controller('loginsuccess',function ($rootScope,$scope,$http,$ionicLoading) {
  var max = "" ;
  $scope.checkCalorie = function (calorie){ 
        console.log(calorie.calories);
        if (calorie.calories == max) {
          return "red";
          console.log(calorie);
        }
      }

  $scope.$on('$ionicView.enter', function(e) {    
    //console.log("called");
      $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];
  
      var clientdetails = JSON.parse(window.localStorage.getItem("clientDetails"));
      console.log(clientdetails);
      $ionicLoading.show({
        template: "Loading..."
      });

      var uid = clientdetails.id;
      $scope.name = clientdetails.name;
      //alert(uid);
      $scope.calorielists = {};
      var req = {
      method: 'POST',
      url: ' http://calorie.textilemarketresearch.com/services/listCalories?userid='+uid+''  
      }
      $http(req).success(function(data){
        //console.log(data.status);
        if(data.status == 0 || data.status == " " ){
            $scope.message = data.message;
            $ionicLoading.hide();
        }
        else{
          console.log(JSON.stringify(data));
          $scope.calorielists = data;
           var len = 0;
            for (var o in data) {
                  len++;
              }            
            //console.log(data);
            for (var i = 0; i < len; i++) {
                cal = parseInt(data[i]['calories']);
                if( cal > max){
                   max = cal;
                   $scope.max = cal;
                   //console.log(max);
                }

            }
            console.log(max);
          $ionicLoading.hide();
        }
      })
    .error(function(){
      alert("No response from Server");
      $ionicLoading.hide();
    });

  });
})

.controller('loginCtrl', function($rootScope,$scope,$http, $state, myservice, $ionicLoading) {

  $scope.$on('$ionicView.beforeEnter', function($state) {
          var clientdetails = window.localStorage.getItem("clientDetails");
          if(clientdetails == null){
             //alert("Please Log in to continue");
             console.log("please login to continue");
          }
          else{
            console.log("logged in still");
            $rootScope.goToState('main.page4');
          }
  });
   // Form data for the login modal
  $scope.loginData = {};
  $scope.clientdetails = {};
  
  $scope.login = function() {
    $ionicLoading.show({
      template: "Loading..."
    });    
    var mobile = $scope.loginData.mobile;
    var password =$scope.loginData.password;

    if( mobile == null  || password == null){
      alert("mobile or password should not be null");
      $ionicLoading.hide();
      return ;
    }
    else{
      if(mobile.toString().length != 10){
        alert("Mobile must be 10 digits.");
        $ionicLoading.hide();
        return;
      }
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
  } 
})

.controller('editProfileCtrl', function($http,$scope,$filter,$ionicLoading,$rootScope,$state) {

  $scope.genderOpts = [
      {name:'Male', value:'1'},
      {name:'Female', value:'2'}
    ];

  $scope.opts = [
      {name:'Yes', value:'1'},
      {name:'No', value:'0'}
    ];

    $scope.marriedOpts = [
      {name:'Single', value:'1'},
      {name:'Married', value:'2'},
      {name:'Divorced', value:'3'},
      {name:'Widow', value:'4'}
    ];

    $scope.drinkerOpts = [
      {name:'Everyday', value:'1'},
      {name:'Once a week', value:'2'},
      {name:'Once a fortnight', value:'3'},
      {name:'Once a month', value:'4'},
      {name:'No', value:'5'}
    ];


  getCityId = function (city){

        var len = 0;
        for (var o in $scope.cities) {
              len++;
          }

          for (var i = 0; i < len; i++) {
            if (city == $scope.cities[i].city_name){
                  console.log("Matched :" + $scope.cities[i].city_id ); 
                  return $scope.cities[i].city_id;             
            }
        }
    }

  getCityName = function (cityId){
      var len = 0;
      for (var o in $rootScope.cities) {
            len++;
        }
        
        for (var i = 0; i < len; i++) {
          //console.log("city id :-" + cityId + "compare id :-" + $rootScope.cities[i].city_id);
          if (cityId == $rootScope.cities[i].city_id){
                console.log("Matched :" + $scope.cities[i].city_name ); 
                return $scope.cities[i].city_name;             
          }
      }

  }

  checkValue = function (data){
        if(data == 1){
          //console.log("called check 0");
            return 0;
        }
        if (data == 2){
          //console.log("called check 1");
            return 1;
        }  
        if(data == 3){
          //console.log("called check 0");
            return 2;
        }
        if (data == 4){
          //console.log("called check 1");
            return 3;
        }
        if(data == 5){
          //console.log("called check 0");
            return 4;
        }      
    }
  CheckSelect = function (data){

        if(data == 0){
          //console.log("called check 0");
            return 1;
        }
        if (data == 1){
          //console.log("called check 1");
            return 0;
        } 
        else if (data == 2){
          //return 1;
        }

    };

  $scope.edit = {};
  var clientdetails = JSON.parse(window.localStorage.getItem("clientDetails"));
  console.log(JSON.stringify(clientdetails));

    $scope.edit.fullname = clientdetails.name;
    $scope.edit.dob = new Date(clientdetails.dob);
    //console.log(CheckSelect(parseInt(clientdetails.gender)));
    $scope.edit.gender = $scope.genderOpts[checkValue(parseInt(clientdetails.gender))];
    $scope.edit.heightfeet = clientdetails.hfeet;
    $scope.edit.heightinches =clientdetails.hinch;
    $scope.edit.weight =clientdetails.weight;
    $scope.edit.waistline =clientdetails.waist; 
    $scope.edit.drinker = $scope.drinkerOpts[checkValue(parseInt(clientdetails.drinker))];
    $scope.edit.married = $scope.marriedOpts[checkValue(parseInt(clientdetails.married))];
    $scope.edit.daibetic = $scope.opts[CheckSelect(parseInt(clientdetails.diabetes))];
    $scope.edit.hypertensive = $scope.opts[CheckSelect(parseInt(clientdetails.hypertension))];
    $scope.edit.kidney = $scope.opts[CheckSelect(parseInt(clientdetails.kidney))];
    $scope.edit.smoker = $scope.opts[CheckSelect(parseInt(clientdetails.smoker))];
    //$scope.edit.daibetic = clientdetails.diabetes;
    //$scope.edit.hypertensive = clientdetails.hypertension;
    //$scope.edit.kidney = clientdetails.kidney;
    //$scope.edit.smoker = clientdetails.smoker;
    //$scope.edit.teeto = clientdetails.teeto;
    $scope.edit.mobile = clientdetails.mobile;
    $scope.edit.email = clientdetails.email.trim();
    $scope.edit.street1 =clientdetails.street1;
    $scope.edit.street2 =clientdetails.street2;
    $scope.edit.city = getCityName(parseInt(clientdetails.city_id));
    $scope.edit.pin =clientdetails.pin;
    $scope.edit.drname = clientdetails.doctor_name;
    $scope.edit.drplace = clientdetails.doctor_place;    
 /*
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
      var confirmPopup = $ionicPopup.confirm({
       title: 'Calorie Tracker',
       template: 'Not able to load cities, Retry ???'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $state.reload();
       } else {
         console.log('You are not sure');
         return;
       }
     });
      $ionicLoading.hide();
    });*/

    

  $scope.editUser = function(){
    $ionicLoading.show({
      template: "Loading..."
    });
    var fullname = $scope.edit.fullname;
    var dob = $filter('date')($scope.edit.dob,'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
    var gender = $scope.edit.gender.value;
    var married = $scope.edit.married.value;
    var drinker = $scope.edit.drinker.value;
    var hfeet = $scope.edit.heightfeet;
    var hinch = $scope.edit.heightinches;
    var weight = $scope.edit.weight;
    var waist = $scope.edit.waistline;
    var diabetes = $scope.edit.daibetic.value;
    var hypertension = $scope.edit.hypertensive.value;
    var kidney = $scope.edit.kidney.value;
    var smoker = $scope.edit.smoker.value;
    //console.log("diabetes "+ diabetes + ":hypertension :" +hypertension)
    var teeto = 0;
    var mobile = $scope.edit.mobile;
    var email = $scope.edit.email;
    var street1 = $scope.edit.street1;
    var street2 = $scope.edit.street2;
    console.log($("#cityName").val());
    var city = getCityId($("#cityName").val()); 
    console.log(city);
    var pin = $scope.edit.pin;
    var drname = $scope.edit.drname;
    var drplace = $("#drPlace").val();
    console.log(JSON.stringify($scope.edit));
    
    var req = {
        method: 'POST',
        url: 'http://calorie.textilemarketresearch.com/services/editUsers',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: "mobile="+mobile+"&name="+fullname+"&dob="+dob+"&gender="+gender+"&married="+married+"&hfeet="+hfeet+"&hinch="+hinch+"&weight="+weight+"&waist="+waist+"&diabetes="+diabetes+"&hypertension="+hypertension+"&kidney="+kidney+"&smoker="+smoker+"&drinker="+drinker+"&teeto="+teeto+"&mobile="+mobile+"&email="+email+"&street1="+street1+"&street2="+street2+"&city_id="+city+"&pin="+pin+"&doctor_name="+drname+"&doctor_place="+drplace+""              
    }
    
    $http(req).success(function(data){
        if(data.status == 1){
          //alert(JSON.stringify(data))
          window.localStorage.removeItem("clientDetails");
          var clientDetails = JSON.stringify(data.details);
          window.localStorage.setItem("clientDetails",clientDetails);
          alert(data.message);
          $ionicLoading.hide();
          //$state.go('main.page4');
        }
        else{
          alert(data.message);
          $ionicLoading.hide();
        }
    })
    
    .error(function(){
      alert("No response from Server");
      $ionicLoading.hide();
    });
  } 
})

.filter('totalSumPriceQty', function () {
    return function (data, key1, key2) {        
        if (data == 'undefined' && key1 == 'undefined' && key2 == 'undefined') {
            return 0;
        }
        var len = 0;
        for (var o in data) {
              len++;
          }
        var sum = 0;
        for (var i = 0; i < len; i++) {
            sum = sum + (parseInt(data[i][key1]) * parseInt(data[i][key2]));
        }
        return sum;
    }
})

.filter('formatDate', function($filter) {

  // Create the return function
  // set the required parameter name to **number**
  return function(date) {

    var d = new Date(date);
     var date1 = $filter('date')(d,'mediumDate');
    return date1;
  }
})

// Setup the filter
.filter('checkEvent', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(evnt) {

    // Ensure that the passed in data is a number
   /* if(isNaN(dish) || dish < 1) {
      // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
      return dish;
    } 
    else {*/
      //console.log(dish);
      // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.
      if(evnt == 1) {
        return 'Break Fast';
      } else if(evnt == 2) {
        return 'Lunch';
      } else if (evnt == 3) {
        return 'Dinner';
      }else if (evnt == 4) {
        return 'Beverages';
      }else if (evnt == 5) {
        return 'Snacks';
      }
  }
})


.filter('sumOfValue', function () {
    return function (data, key) {
        /*if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
            return 0;
        }*/
        var sum = 0;
        if (data == 'undefined' && key == 'undefined') {
            return 0;
        }else{

        
        var len = 0;
        for (var o in data) {
              len++;
          }
       // console.log(data);
        for (var i = 0; i < len; i++) {
            sum = sum + parseInt(data[i][key]);
        }

      }
        return sum;
    }
})
;
