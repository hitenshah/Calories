angular.module('starter.controllers', [])

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
