Ext.define('app.views.transferhistorygrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'transferhistorygrid',

  reference: 'transferhistorygrid',

  bind: '{transfer_history}',

  height: 400,
  collapsible: true,
  loadMask: true,

  viewConfig: {
    trackOver: false,
    emptyText: 'Keine Einträge gefunden'
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
    {
      text: 'Aktion',
      width: 70,
      dataIndex: 'command',
      renderer: function(val) {
        color = {
          'RETR': 'green',
          'STOR': 'orange',
          'DELE': 'red',
        }[val];
        icon = {
          'RETR': 'x-fa fa-upload',
          'STOR': 'x-fa fa-download',
          'DELE': 'x-fa fa-trash',
        }[val];
        return '<div class="'+icon+'"style=" color: '+color+';">&nbsp;' + val + '</div>'
      },
    },
    { text: 'Datei', dataIndex: 'filename', flex: 1 },
    { text: 'Größe', dataIndex: 'bytes', renderer: function(value, record){ return (value.fileSize(1)) }},
    { text: 'Protokol', dataIndex: 'protocol' },
    { text: 'IP', dataIndex: 'client_ip' },
  ]
});
