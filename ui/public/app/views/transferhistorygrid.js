Ext.define('app.views.transferhistorygrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'transferhistorygrid',

  reference: 'transferhistorygrid',

  bind: '{transfer_history}',

  height: 400,
  collapsible: true,
  loadMask: true,

  viewConfig: {
    trackOver: false
  },

  title: "Transfers",

  columns: [
    {
      xtype: 'datecolumn',
      format: 'd.m.Y H:i:s',
      text: 'Zeitpunkt',
      width: 150,
      dataIndex: 'transfer_date',
    },
    { text: 'Kommando', dataIndex: 'command' },
    { text: 'Datei', dataIndex: 'filename', flex: 1 },
    { text: 'Größe', dataIndex: 'bytes', renderer: function(value, record){ return (value.fileSize(1)) }},
    { text: 'Protokol', dataIndex: 'protocol' },
    { text: 'IP', dataIndex: 'client_ip' },
  ]
});
