'use strict';

var portastic = require('portastic');
var BBPromise = require('bluebird');
var fs = require('fs');
var writeFilePromisified=BBPromise.promisify(fs.writeFile);
var path = require('path');

//these ndjs modules will be injected for us
myModuleFactory.$inject=['$job','$uiActions','$utils','$state','$logger'];
module.exports=myModuleFactory;

function myModuleFactory($job,$uiactions,$utils,$state,$logger)
{
  $logger.debug('registering myModule');
  //we register two actions and one jobtype to ndjs
  //these two actions will later be available in the angualr ui frontent
  $uiactions.registerAction(
    'checkPortOpen'/*action name*/,
    ['port']/*param names*/,
    checkPortOpen/*callback function to run*/);
  $uiactions.registerAction('runServer',[],runServer);
  $uiactions.registerAction('getDefaultDir',[],getDefaultDir);

  //register job type myConfig - specified to run in ndfile.js
  $job.registerJobType(myConfigJobFactory,'myConfig');
  function myConfigJobFactory()
  {
    //this job will configure apache tomcat to run on the end machine
    //we first configure ports in conf/server.xml then specifying java's path
    //in bin/setenv.bat
    var userConfig=$state.getSettings('user.config');
    var serverXmlPath=userConfig.installDir+'/conf/server.xml';
    $logger.debug('setting http port');
    return $utils.setXmlFileProps(
      //returns a promise that when finished configured xml using xpath
      serverXmlPath,
      //keys are xpath to find - values replacement tokens
      { '//Connector[@protocol="HTTP/1.1"]/@port' :userConfig.http,
        '//Server/@port'                          :userConfig.shutdown})
        .then(function(){
          //chain another promise: write string to the setenv.bat file
        return writeFilePromisified
          (userConfig.installDir+'/bin/setenv.bat',
          'SET JAVA_HOME='+userConfig.installDir+'\\jre');
      }).then(function()
    {
      //create a property file
      return writeFilePromisified
        (userConfig.installDir+'/webapps/ROOT/WEB-INF/conf.properties',
        'myserver.org.adminpass='+userConfig.adminPass);
    });
  }
  /**
  this function test if <port> is open
  it is registered as action and will be available in the UI frontend
  **/
  function checkPortOpen(port)
  {
    return portastic.test(port);//returns a promise
  }
  function runServer()
  {
    var installDir=$state.getSettings('user.config.installDir');
    var binDir=path.join(installDir,'bin');
    var runCmd=path.join(installDir,'bin','startup.bat');

    return $utils.runShellCmdAndDetach(runCmd,[],binDir);//returns a promise
  }
  function getDefaultDir()
  {
    if(process.env.ProgramW6432){
      return path.join(process.env.ProgramW6432,'my-server');
    }
    else
    {
      return path.join(process.env.programfiles,'my-server');
    }

  }





  return {};//our module publish no interface

}