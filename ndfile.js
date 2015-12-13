module.exports = function (ndjs) {
'use strict';
    ndjs.initConfig(
{
  'options':
  {
    'frontend':'front',/*UI views directory*/
    'backend':'back',/*custom NDJS modules directory*/
    'outgoing':'outgoing',/*directory of file to be compressed and distibuted with installer*/
    'etc':'etc',/*directory of other assets - icon for example*/
    'window':/*will be included in nwjs setting file: https://github.com/nwjs/nw.js/wiki/manifest-format#window-subfields */
    {
      'frame':false,
      'toolbar': true,
      'width': 720,
      'height': 440,
	    'icon': 'images/duck.png'
    },
    /* meta fields of exe*/
    'description':'my first NDJS installer',
    'productname':'my NDJS installer',
    'company':'ACME',
    'version':'1.0.0.0',
    'icon':'duck.ico'
  },
  /*install stage*/
	'install':
	{
		'pages':  /*install stage pages*/
		[
      'welcome','eula','config','extract','conclusion','abort'
		],
		'jobs':/*install stage jobs*/
		{
      'main':
			{'type':'multi','settings':{'subJobs':[
				{'type':'sfx','settings':{'files':[
          {'from':'tomcat','to':'<%=user.config.installDir%>','size':14},
          {'from':'jre','to':'<%=user.config.installDir%>/jre','size':94},
          {'from':'webapp','to':'<%=user.config.installDir%>/webapps/ROOT','size':0}]}},
        {'type':'myConfig'}
			]}}
		}
	},
  /*uninstall stage*/
	'uninstall':
	{
		'pages':/*uninstall stage pages*/
    [
      'confirm','uninstallprogress','bye'
		],
		'jobs':{/*uninstall stage jobs*/
    'remove':
      {'type':'delete','settings':{}}
	}}
});
};
