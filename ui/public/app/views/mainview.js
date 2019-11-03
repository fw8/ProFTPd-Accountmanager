Ext.define('app.views.mainview', {
  extend: 'Ext.container.Viewport',

  controller: 'accounts',

  viewModel: 'accounts',

  layout: 'border',

  items: [{
    region: 'center',
    xtype: 'accountsgrid',
    minHeight: 200,
    hight: 400,
    flex: 1,
  }, {
    region: 'south',
    collapsible: true,
    collapsed: true,
    xtype: 'transferhistorygrid',
    split: true,
    flex: 2
  }],

});