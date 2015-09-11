// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'starter.controllers', 'ngMessages'])

.run(function($ionicPlatform,$state,$timeout,$ionicPopup) {
$ionicPlatform.registerBackButtonAction(function () {
  var confirmPopup = $ionicPopup.confirm({
       title: 'Calorie Tracker',
       template: 'Are you sure you want to Exit?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          navigator.app.exitApp();
       } else {
         console.log('You are not sure');
         return;
       }
     }); 
  },100);


  $ionicPlatform.ready(function() {

    var applaunch = window.localStorage.getItem("applaunch");
    if(applaunch){
        window.localStorage.removeItem("applaunch")
        return;
    }
    else{
      $state.go('page8');
      $timeout(function() {
          window.localStorage.setItem("applaunch",1);
          $state.go('page1');
      }, 5000);
      //$state.go('page8');
    }
    //console.log("in run platform ready");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.views.forwardCache(true);
  $ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('page1', {
      url: '/home',
      templateUrl: 'page1.html'
    })

    .state('page2', {
      url: '/login',
      cache: false,
      templateUrl: 'page2.html',
      controller: 'loginCtrl'
    })
    
    .state('page3', {
      url: '/signup',
      templateUrl: 'page3.html',
      controller : 'signupCtrl'
    })

    .state('page8', {
      url: '/about1',
      templateUrl: 'page8.html'
    })

/*.state('about', {
      url: '/about',
      templateUrl: 'about.html'
    })*/
    .state('page5', {
      url: '/forgotpassword',
      templateUrl: 'page5.html',
      controller : 'forgotpassword'
    })

    .state('main', {
      url : '/main',
      templateUrl : 'mainContainer.html',
      abstract : true,
      controller : 'MainController'
    })

    .state('main.page4', {
      url: '/login-success',
      views: {
        'main': {
          templateUrl: 'page4.html',
          controller : 'loginsuccess'
        }
      }
    })

    .state('main.about', {
      url: '/about',
      views: {
        'main': {
          templateUrl: 'about.html'
        }
      }
    })

    .state('main.page10', {
      url: '/changepassword',
      views: {
        'main': {
          templateUrl: 'page10.html',
          controller : 'changepasswordCtrl'
        }
      }
    })

    .state('main.page11', {
      url: '/editprofile',
      cache : false,
      views: {
        'main': {
          templateUrl: 'page11.html',
          controller : 'editProfileCtrl'
        }
      }
    })

    .state('main.page6', {
      url: '/todayscalorie',
      views: {
        'main': {
          templateUrl: 'page6.html',
          controller : 'todayscalorieCtrl'
        }
      }
    })

.state('main.page7', {
      url: '/detailcalories/:date',
      views: {
        'main': {
          templateUrl: 'page7.html',
          controller : 'getCaloriesCtrl'
        }
      }
    })
    
    ;

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/home');
  

})

//Directive that returns an element which adds buttons on click which show an alert on click
.directive("addbuttonsbutton", function(){
  return {
    restrict: "E",
    template: "<br><button addbuttons class='button button-icon icon ion-plus-round'> <span style='color:#2FA2EC;'>Add Dishes</span></button>"
  }
})

//Directive for adding buttons on click that show an alert on click
.directive("addbuttons", function($compile){
  return function(scope, element, attrs){
    element.bind("click", function(){
      scope.count++; 
      document.getElementById("ctr").value = scope.count;     
      angular.element(document.getElementById('TextBoxesGroup')).append($compile("<label class='item item-select' name='Select Dish'><span class='input-label'>Select Dish</span><select id='"+scope.count+"' ng-model='todayscalorie.dish["+scope.count+"]'><option ng-repeat='dish in dishes[0]' value='{{dish.id}}'>{{dish.name}}</option></select></label><label class='item item-select' name='Select Quantity'><span class='input-label'>Select Quantity</span><select ng-model='todayscalorie.quantity["+scope.count+"]' name='qty"+scope.count+"' id='qty"+scope.count+"'><option ng-value='1'>1</option><option ng-value='2'>2</option><option ng-value='3'>3</option><option ng-value='4'>4</option><option ng-value='5'>5</option></select></label>")(scope));
      //angular.element(document.getElementById('TextBoxesGroup')).append($compile("<label class='item item-select' name='Select Dish"+scope.count+"'><span class='input-label'>Select Dish</span><select data-alert="+scope.count+" id='CitySelector"+scope.count+"' ng-model='todayscalorie.dish["+scope.count+"]' name='dish"+scope.count+"' id='dish"+scope.count+"'><option ng-repeat='dish in dishes["+scope.count+"]' value='{{dish.id}}'>{{dish.name}}</option></select></label><label class='item item-select' name='Select Quantity'><span class='input-label'>Select Quantity</span><select ng-model='todayscalorie.quantity["+scope.count+"]' name='qty"+scope.count+"' id='qty"+scope.count+"'><option ng-value='1'>1</option><option ng-value='2'>2</option><option ng-value='3'>3</option><option ng-value='4'>4</option><option ng-value='5'>5</option></select></label>")(scope));
      //angular.element(document.getElementById('TextBoxesGroup')).append($compile("<label class='item item-select' name='Events'><span class='input-label'>Events</span><select ng-model='todayscalorie.event["+scope.count+"]' data-ctr='"+scope.count+"' id = '"+scope.count+"' ng-click='testClick($event)' ng-change='getDishes(todayscalorie.event["+scope.count+"])' name='event"+scope.count+"' id='event"+scope.count+"'><option ng-value='1'>Break Fast</option><option ng-value='2'>Lunch</option><option ng-value='3'>Dinner</option><option ng-value='4'>Beverages</option><option ng-value='5'>Snacks</option></select></label><label class='item item-select' name='Select Dish"+scope.count+"'><span class='input-label'>Select Dish</span><select id='CitySelector"+scope.count+"' ng-model='todayscalorie.dish["+scope.count+"]' name='dish"+scope.count+"' id='dish"+scope.count+"'><option ng-repeat='dish in dishes["+scope.count+"]' value='{{dish.id}}'>{{dish.name}}</option></select></label><label class='item item-select' name='Select Quantity'><span class='input-label'>Select Quantity</span><select ng-model='todayscalorie.quantity["+scope.count+"]' name='qty"+scope.count+"' id='qty"+scope.count+"'><option ng-value='1'>1</option><option ng-value='2'>2</option><option ng-value='3'>3</option><option ng-value='4'>4</option><option ng-value='5'>5</option></select></label>")(scope));
      //angular.element(document.getElementById('TextBoxesGroup')).append($compile("<br><br><label class='item item-select' name='Events'><span class='input-label'>Events</span><select ng-model='todayscalorie.event["+scope.count+"]' ng-change='getDishes(todayscalorie.event["+scope.count+"])' name='event"+scope.count+"' id='event"+scope.count+"'><option ng-value='1'>Break Fast</option><option ng-value='2'>Lunch</option><option ng-value='3'>Dinner</option><option ng-value='4'>Beverages</option><option ng-value='5'>Snacks</option></select></label><label class='item item-select' name='Select Dish"+scope.count+"'><span class='input-label'>Select Dish</span><select id='CitySelector"+scope.count+"' ng-model='todayscalorie.dish["+scope.count+"]' name='dish"+scope.count+"' id='dish"+scope.count+"'><option ng-repeat='dish in dishes["+scope.count+"]' value='{{dish.id}}'>{{dish.name}}</option></select></label><label class='item item-select' name='Select Quantity'><span class='input-label'>Select Quantity</span><select ng-model='todayscalorie.quantity["+scope.count+"]' name='qty"+scope.count+"' id='qty"+scope.count+"'><option ng-value='1'>1</option><option ng-value='2'>2</option><option ng-value='3'>3</option><option ng-value='4'>4</option><option ng-value='5'>5</option></select></label>")(scope));      
      /*angular.element(document.getElementById('TextBoxesGroup')).append($compile("<label class='item item-select' name='Events'><span class='input-label'>Events</span><select ng-model='todayscalorie.event' ng-change='getDishes()' name='event"+scope.count+"' id='event"+scope.count+"'><option ng-value='1'>Break Fast</option><option ng-value='2'>Lunch</option><option ng-value='3'>Dinner</option><option ng-value='4'>Beverages</option><option ng-value='5'>Snacks</option></select></label><label class='item item-select' name='Select Dish"+scope.count+"'><span class='input-label'>Select Dish</span><select id='CitySelector"+scope.count+"' ng-model='todayscalorie.dish["+scope.count+"]' name='dish"+scope.count+"' id='dish"+scope.count+"'><option ng-repeat='dish in dishes' value='{{dish.id}}'>{{dish.name}}</option></select></label><label class='item item-select' name='Select Quantity'><span class='input-label'>Select Quantity</span><select ng-model='todayscalorie.quantity"+scope.count+"' name='qty"+scope.count+"' id='qty"+scope.count+"'><option ng-value='1'>1</option><option ng-value='2'>2</option><option ng-value='3'>3</option><option ng-value='4'>4</option><option ng-value='5'>5</option></select></label>")(scope));      */
      /*angular.element(document.getElementById('TextBoxesGroup')).append($compile("<label class='item item-select' name='Events'><span class='input-label'>Events</span><select ng-model='todayscalorie.event"+scope.count+"' ng-change='getDishes()' name='event"+scope.count+"' id='event"+scope.count+"'><option ng-value='1'>Break Fast</option><option ng-value='2'>Lunch</option><option ng-value='3'>Dinner</option><option ng-value='4'>Beverages</option><option ng-value='5'>Snacks</option></select></label><label class='item item-select' name='Select Dish"+scope.count+"'><span class='input-label'>Select Dish</span><select id='CitySelector"+scope.count+"' ng-model='todayscalorie.dish' name='dish"+scope.count+"' id='dish"+scope.count+"'><option ng-repeat='dish in dishes' value='{{dish.id}}'>{{dish.name}}</option></select></label><label class='item item-select' name='Select Quantity'><span class='input-label'>Select Quantity</span><select ng-model='todayscalorie.quantity"+scope.count+"' name='qty"+scope.count+"' id='qty"+scope.count+"'><option ng-value='1'>1</option><option ng-value='2'>2</option><option ng-value='3'>3</option><option ng-value='4'>4</option><option ng-value='5'>5</option></select></label>")(scope));*/
    });
  };
});

//Directive for showing an alert on click
/*.directive("alert", function(){
  return function(scope, element, attrs){
    element.bind("click", function(){
      console.log(attrs);
      scope.getDishes(scope.todayscalorie.event[0]);
      //alert("This is alert #"+attrs.alert);
    });
  };
});
*/