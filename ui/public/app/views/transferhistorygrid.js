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
    {
      xtype: 'actioncolumn',
      text: 'Aktion',
      //align: 'center',
      width: 70,
      dataIndex: 'command',
      menuDisabled: true,
      getClass: function (val, meta, rec) {
        return {
          'RETR': 'x-fa fa-upload',
          'STOR': 'x-fa fa-download',
          'DELE': 'x-fa fa-trash',
        }[val];
      },
      renderer: function(val) {
        color = {
          'RETR': 'green',
          'STOR': 'orange',
          'DELE': 'red',
        }[val];
        return '<div style="float:right; font-size: 13px; line-height: 1em; color: '+color+';">' + val + '</div>' // TDOD: better put style into css file
      },
    },
    { text: 'Datei', dataIndex: 'filename', flex: 1 },
    { text: 'Größe', dataIndex: 'bytes', renderer: function(value, record){ return (value.fileSize(1)) }},
    { text: 'Protokol', dataIndex: 'protocol' },
    { text: 'IP', dataIndex: 'client_ip' },
  ]
});
