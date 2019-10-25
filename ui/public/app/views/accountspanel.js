Ext.define('app.views.accountspanel', {
  extend: 'Ext.panel.Panel',
  xtype: 'accountspanel',

  controller: 'accounts',

  viewModel: 'accounts',

  layout: {
    type: 'vbox',
    align: 'stretch'
  },

  title: 'Accounts',

  items: [
    { xtype: 'accountsgrid', flex: 1 },
    { xtype: 'transferhistorygrid', flex: 1, margin: "10 0 0 0" }
  ],
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'top',
      items: [
        {
          xtype: 'button',
          text: 'Neuen Account anlegen',
          listeners: {
            click: 'onAccountAdd'
          },
        },
        {
          xtype: 'button',
          text: 'Neuen Unteraccount anlegen',
          listeners: {
            click: 'onSubAccountAdd'
          },
        },
      ]
    }
  ],

});