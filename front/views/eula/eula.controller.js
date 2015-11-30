(function() {
	'use strict';
	angular.module('myApp')
		.controller('EulaController',EulaController);

	EulaController.$inject=['$scope','ndPager'];
	function EulaController($scope,ndPager)
	{
		var vm=this;
		vm.eulaPath='etc/eula.htm';
		vm.agreeText='I agree to these terms and conditions';
		vm.agreed=false;
		activate();


		function activate()
		{
			$scope.$watch('vm.agreed',ndPager.nextEnabled);
		}

	}

})();
