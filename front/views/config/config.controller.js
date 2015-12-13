(function(){
  'use strict';
  angular.module('myApp')
  .controller('ConfigController',ConfigController);

  ConfigController.$inject=['ndActions','$scope','ndPager','myModalService','ndLogger','$q'];
  function ConfigController(ndActions,$scope,ndPager,myModalService,ndLogger,$q)
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
      loadSettingsAndBind();
      ndPager.registerBeforeLeaveCallback(beforeLeave);
    }
    function loadSettingsAndBind()
    {
      ndActions.state_getUserSettings('config')
      .then(function(ret)
      {
        if(ret && ret.status ==='found')
        {
          //load all settings
          vm.formData=ret.value;
          return ret;
        }
        else {
          //we haven't set settings yet - just get default dir
          return ndActions.getDefaultDir()
            .then(function(dir)
          {
            vm.formData.installDir=dir;
            return vm.formData;
          });

        }
      });
    }
    function beforeLeave(nextPageIndex)
    {
      var myPageIndex=ndPager.getPageNumber();
      if(nextPageIndex===myPageIndex+1)//we are going to the next page
      {
        return ndActions.fs_isDirValid(vm.formData.installDir)//make sure we selected a valid directory
        .then(function(dirIsValid)
        {
          if(!dirIsValid)
          {
            throw new Error('Dir not valid');
          }
        }).then(function()
        {
          return ndActions.fs_isDirEmpty(vm.formData.installDir);//now check if directory is empty
        }).then (function(isEmpty){
          if(isEmpty)
          {
            return true;//may continue
          }
          else {
            return askDirNotEmptyContinue(vm.formData.installDir);//dir is not empy show modal and ask to user - should we continue?
          }
        }).catch(function(err)
      {
        if(err.message==='Dir not valid')
        {
          showModalDirNotValid(vm.formData.installDir);
        }
        else {
          ndLogger.error(err);
        }
        return false;
      });
      }
      else {
        return true;//may continue
      }
    }

    function showModalDirNotValid(dir)
    {
      return myModalService.showModal(
        {title:'Directory invalid',
        message:'Directory '+dir+' is invalid. Please choose a valid directory',
        buttons:['OK']});
    }
    /**
    This function opens a modal and returns a promise resolved to whether the user agreed to continue with a non-empty dir
    **/
    function askDirNotEmptyContinue(dir)
    {
      return $q(function(resolve)
      {
        myModalService.showModal(
        {title:'Directory not empty',
        message:'Directory '+dir+' is not empty, do you want to continue?',
        buttons:[
          {caption:'Yes', action:function(){resolve(true);}},
          {caption:'No',action:function(){resolve(false);}}],
        dismiss:function(){resolve(false);}}
      );
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
          ndActions.state_setUserSettings('config',vm.formData);
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
