module.exports = function (ndjs) {
'use strict';
    ndjs.initConfig(
{
  'options':
  {
    'frontend':'front',
    'backend':'back',
    'outgoing':'outgoing',
    'etc':'etc',

    'window':
    {
      'frame':false,
      'toolbar': false,
      'width': 720,
      'height': 440,
	    'icon': 'duck.png'
    },

    'description':'my first NDJS installer',
    'productname':'my NDJS installer',
    'company':'ACME',
    'version':'1.0.0.0',
    'icon':'duck.ico'

  },
	'install':
	{
		'pages':
		[
      'welcome','eula','config','extract','conclusion'
		],
		'jobs':
		{
      'main':
			{'type':'multi','settings':{'subJobs':[
				{'type':'extract','settings':{'files':[
          {'from':'tomcat','to':'<%=user.config.installDir%>','size':109},
          {'from':'jre','to':'<%=user.config.installDir%>/jre','size':93},
          {'from':'webapp','to':'<%=user.config.installDir%>/webapps/ROOT','size':0}]}},
        {'type':'myConfig'}
			]}}
		}
	},
	'uninstall':
	{
		'pages':
		[
			{'name':'confirm','type':'custom'},
			{'name':'remove','type':'progress','settings':{'job':'remove'}},
			{'name':'conclusion','type':'custom'}
		],
		'jobs':
		[
			{'name':'remove','settings':[{'type':'delete',settings:{dir:''}}]}

			]

	}
});

};
