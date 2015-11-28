(function(){
'use strict';


	angular.module('myApp')
		.controller('ConclusionController', ConclusionController);

	ConclusionController.$inject=['ndPager','ndWindow','ndActions'];
	function ConclusionController(ndPager,ndWindow,ndActions)
	{
		var vm=this;
		vm.runServer=true;
		vm.finish=finish;
		activate();
		function activate()
		{
			ndPager.backEnabled(false);
			ndPager.nextEnabled(false);

		}
		function finish()
		{
			if(vm.runServer)
			{
				ndActions.runServer().finally(ndWindow.close);
			}
			else
			{
				ndWindow.close();
			}

		}
	}
})();
