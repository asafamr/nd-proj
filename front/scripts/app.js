(function(){
'use strict';



angular.module('myApp', [
  //'ngCookies',
  //'ngResource',
  //'ngSanitize',
  'ui.router',
  'ui.bootstrap',
	'ngJsTree',
	'ndAngular'

])


.controller('MainController',MainController);

MainController.$inject=['$state','$scope'];
 function MainController($state,$scope) {
	void ($state);
    //var vm=this;
  //  $scope.minimize=ndAngular.window.minimize;
    //$scope.close=ndAngular.window.close;


}
})();
