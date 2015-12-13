(function(){
'use strict';

  angular.module('myApp')
		.controller('ModalInstanceController', ModalInstanceController);
    ModalInstanceController.$inject=['$scope', '$uibModalInstance', 'data'];
  	function ModalInstanceController($scope, $uibModalInstance, data)
  	{
      var vm=this;
      vm.title='';
      vm.message='';
      vm.buttons=[];
      vm.clickedButton=clickedButton;
      activate();
      function activate()
      {
        vm.title=data.title;
        vm.message=data.message;
        vm.buttons=data.buttons;
      }
      function clickedButton(idx)
      {
        $uibModalInstance.close(vm.buttons[idx].action());
      }
    }
})();
