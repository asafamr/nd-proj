(function (){
	'use strict';
	angular
		.module('myApp')
		.factory('myModalService', MyModalService );

	MyModalService.$inject=['$uibModal'];
	function MyModalService($uibModal/*ndPages,ndLogger,$state,$q*/)
	{
		var currentModalInstance;
		activate();
		return {
			showModal:showModal,
      closeModal:closeModal
		};

		function activate()
		{


		}

    function closeModal()
    {
      if(currentModalInstance)
      {
        currentModalInstance.dismiss('closed by service');
      }
    }

		function showModal(params)
		{
      closeModal();

      currentModalInstance=$uibModal.open({
        //ui bootstrab modal parameters could be found here: https://angular-ui.github.io/bootstrap/
        animation: true,
        templateUrl: 'services/modal/modal.html',
        controller: 'ModalInstanceController',
        controllerAs: 'vm',
				backdrop :'static',
        size: 'lg',
        resolve:
        {
          data:{
            title: params.title || 'Error',
            message: params.message || 'Unspecified error',
						buttons: params.buttons || [{caption:'OK',action:function(){}}]
          }
        }
      });
      return currentModalInstance.result.finally(function(ret)
		{
			currentModalInstance=null;
			return ret;
		});
		}



	}
})();
