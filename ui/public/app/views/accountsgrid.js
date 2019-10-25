Ext.define('app.views.accountsgrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'accountsgrid',

  reference: 'accountsgrid',

  bind: '{accounts}',

  viewConfig: {
    markDirty: false,
    overItemCls: '',
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
    {
      text: 'Account',
      dataIndex: 'sortname',
      width: 200,
      renderer: function(value, meta, record) {
        var parent = record.get('parent'),
            id = record.get('id');
        if (parent) {
          return parent+'/<b>'+id+'</b>';
        } else {
          return '<b>'+id+'</b>';
        }
      }
    },
    { text: 'Anmeldungen', dataIndex: 'count' },
    {
      xtype: 'datecolumn',
      format: 'd.m.Y H:i:s',
      text: 'Letzte Anmeldung', dataIndex: 'last_accessed',
      width: 150,
    },
    { xtype: 'widgetcolumn',
      text: 'Plattenbelegung',
      dataIndex: 'usage',
      widget: {
        xtype: 'progressbarwidget',
        textTpl: '{value:percent}'
      },
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
        handler: 'onAccountRemove',
        isDisabled: function (view, rowIndex, colIndex, item, record) {
          return record.get('has_children');
        }
      }]
    },
  ],
  listeners: {
    select: 'doLoadTransferHistory',
  },
});
