(function() {
	'use strict';
	angular.module('myApp')
		.controller('ExtractController',ExtractController);

	ExtractController.$inject=['$scope','ndPager','ndJobManager', 'myModalService'];
	function ExtractController($scope,ndPager,ndJobManager, myModalService)
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
			ndJobManager.startJob('main',false /*if started already- dont do anything*/ ,pendingCallback);
			$scope.$watch(function(){return ndJobManager.getJobProgress('main');},updateMainProgress);
			ndPager.preventBackFromHere();
			ndPager.nextEnabled(false);
		}
		function pendingCallback(err,details,options,answerCallback)
		{
			var message='Job main error: '+err;
			//should be sent to i18n service instead
			var mapError={
				ENOENT:'Source file is missing: '+details,
				EPERM:'No permissions to write: '+details,
				EBUSY:'File is being used: '+details};
				message=mapError[err] ||message;
        myModalService.showModal(
        {title:'Error',
        message:message,
        buttons:[
					{caption:'Retry', action:function(){answerCallback('retry');}},
					{caption:'Ignore', action:function(){answerCallback('ignore');}},
          {caption:'Abort', action:function(){answerCallback('abort');ndPager.gotoPageName('abort');}}],
        dismiss:function(){answerCallback('abort');}}
      );
		}

	}

})();
