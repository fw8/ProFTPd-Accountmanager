Ext.define('app.views.accountsgrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'accountsgrid',

  reference: 'accountsgrid',

  bind: '{accounts}',

  layout: {
    type: 'vbox',
    align: 'stretch'
  },

  viewConfig: {
    markDirty: false,
 //   overItemCls: '',
  },

  columns: [
    {
      xtype: 'actioncolumn',
      text: "Aktiv",
      align: 'center',
      //tooltip: 'Toggle Status',
      getTip:function( value, meta, rec ) {
        return ((rec.get('enabled')) ? 'Sperren' : 'Aktivieren')
      },
      getClass: function (val, meta, rec) {
        return ((rec.get('enabled')) ? 'x-fa fa-check-circle' : 'x-fa fa-times-circle')
      },
      handler: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        rec.set('enabled', !rec.get('enabled'));
        rec.store.sync();
      },
    },
    { text: 'Name', dataIndex: 'userid', width: 200 },
    { text: 'Anmeldungen', dataIndex: 'count' },
    {
      xtype: 'datecolumn',
      format: 'd.m.Y H:i:s',
      text: 'Letzter Zugriff', dataIndex: 'last_accessed',
      flex: 1
    },
    { text: 'Größe', dataIndex: 'du', renderer: function(value, record){ return (value.fileSize(1)) }},
    {
      xtype: 'actioncolumn',
      text: "Aktion",
      align: 'center',
      items: [{
        iconCls: 'x-fa fa-key',
        tooltip: 'Passwort ändern',
        handler: 'onSetPassword',
      },{
        iconCls: 'x-fa fa-trash',
        tooltip: 'Löschen',
        handler: function(grid, rowIndex, colIndex) {
          var rec = grid.getStore().getAt(rowIndex);
          Ext.Msg.show({
            title: 'Löschen?',
            message: 'Soll der Account wirklich gelöscht werden?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId) {
              if (buttonId == 'yes') {
                rec.store.remove(rec);
                rec.store.sync();
                //App.util.Util.showToast('Kontakt erfolgreich gelöscht.');
              }
            }
          });
        },
      }]
    },
  ],
  listeners: {
    select: 'doLoadTransferHistory',
  },
});
