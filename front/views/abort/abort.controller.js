(function(){
'use strict';


	angular.module('myApp')
		.controller('AbortController', AbortController);

	AbortController.$inject=['ndPager','ndWindow'];
	function AbortController(ndPager,ndWindow)
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
			ndWindow.close();
		}
	}
})();
