(function() {
	'use strict';
	angular.module('myApp')
		.controller('ExtractController',ExtractController);

	ExtractController.$inject=['$scope','ndPager','ndJobManager'];
	function ExtractController($scope,ndPager,ndJobManager)
	{
		var vm=this;
		vm.progress=0;
		vm.interval=null;
		vm.agreeText='I agree to these terms and conditions';
		vm.agreed=false;
		activate();

		function updateMainProgress(progress)
		{
			vm.progress=progress;
			if(vm.progress===1)
			{
				ndPager.nextEnabled(true);
			}
		}
		function activate()
		{
			ndJobManager.startJob('main',false/*if started already- dont do anything*/);
			$scope.$watch(function(){return ndJobManager.getJobProgress('main');},updateMainProgress);
			ndPager.preventBackFromHere();
			ndPager.nextEnabled(false);
		}
		/*$scope.$on('jobstatus',function(angEvent,event)
	{
		var jobName=event.value.jobname;
		var progress=event.value.progress;
		if(jobName==='main')
		{
			vm.progress=progress;
		}
	});*/

	}

})();
