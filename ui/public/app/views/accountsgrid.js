Ext.define('app.views.accountsgrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'accountsgrid',

  reference: 'accountsgrid',

  bind : '{accounts}',

  layout: {
    type: 'vbox',
    align: 'stretch'
  },

  columns: [
    { text: 'Name', dataIndex: 'userid', width: 200 },
    { text: 'Status', dataIndex: 'status' },
    { text: 'Zugriffe', dataIndex: 'count' },
    {
      xtype: 'datecolumn',
      format: 'd.m.Y H:i:s',
      text: 'Letzter Zugriff', dataIndex: 'last_accessed',
      flex: 1
    }
  ],
});
