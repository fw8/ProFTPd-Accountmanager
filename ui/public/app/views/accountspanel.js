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
    { xtype: 'accountsgrid', flex: 1 }
  ],
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'top',
      items: [
        {
          xtype: 'button',
          text: 'Neu',
          listeners: {
            click: 'onAdd'
          },
        },
        {
          xtype: 'button',
          text: 'Passwort ändern',
          listeners: {
            click: 'onChangePassword'
          },
          bind: {
            disabled: '{!accountsgrid.selection}'
          }
        },
        {
          xtype: 'button',
          text: 'Löschen',
          listeners: {
            click: 'onDelete'
          },
          bind: {
            disabled: '{!accountsgrid.selection}'
          }
        }
      ]
    }
  ],

});