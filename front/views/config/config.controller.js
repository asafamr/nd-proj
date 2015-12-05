(function(){
'use strict';
angular.module('myApp')
  .controller('ConfigController',ConfigController);

ConfigController.$inject=['ndActions','$scope','ndPager'];
function ConfigController(ndActions,$scope,ndPager)
{
  var vm=this;
  vm.formData={};
  vm.formData.http=8090;
  vm.formData.shutdown=8091;
  vm.formData.adminPass='';
  vm.httpPortChecked='not checked';
  vm.shutdownPortChecked='not checked';
  vm.checkPort=checkPort;
  vm.formData.installDir='';
  vm.formErrors=[];
  $scope.$watch('vm.formData',validate,true);

  activate();
  function activate()
  {
    ndActions.getDefaultDir().then(function(dir)
  {
    vm.formData.installDir=dir;
  });
  }
  function checkPort(number,out)
  {
    if(!isValidPort(number))
    {
      vm[out]='closed';
    }
    ndActions.checkPortOpen(number).then(
      function(isOpen){
        vm[out]=isOpen&&'open'||'closed';
      });
  }
  function validate()
  {
    vm.formErrors=[];
    if(!isValidPort(vm.formData.http))
    {
      vm.formErrors.push('HTTP port invalid');
    }
    if(!isValidPort(vm.formData.shutdown))
    {
      vm.formErrors.push('Shutdown port invalid');
    }
    if(!isValidPass(vm.formData.adminPass))
    {
      vm.formErrors.push('Password must be longer than 5 characters and must contain at least one lowercase letter, one uppercase letter and one digit');
    }
    ndPager.nextEnabled(vm.formErrors.length===0);
    if(vm.formErrors.length===0)
    {
      ndActions.setUserSettings('config',vm.formData);
    }
  }
  function isValidPort(num)
  {
    return angular.isNumber(num)&& num>0 && num< 65535;
  }
  function isValidPass(pass)
  {
    return pass.length>=6 && /[0-9]+/.test(pass) &&/[a-z]+/.test(pass)&&/[A-Z]+/.test(pass);
  }

}
})();
