Ext.define('app.views.accountsgrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'accountsgrid',

  reference: 'accountsgrid',

  bind: '{accounts}',

  viewConfig: {
    markDirty: false,
    overItemCls: '',
  },

  title: 'Accounts',

  columns: [
    {
      xtype: 'actioncolumn',
      text: "Aktiv",
      align: 'center',
      //tooltip: 'Toggle Status',
      getTip:function( value, meta, rec ) {
        return ((rec.get('enabled')) ? 'Aktiv' : 'Gesperrt')
      },
      getClass: function (val, meta, rec) {
        return ((rec.get('enabled')) ? 'x-fa fa-check-circle-o' : 'x-fa fa-ban')
      },
      handler: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        rec.set('enabled', !rec.get('enabled'));
        rec.store.sync();
      },
    },
    {
      xtype: 'actioncolumn',
      text: "Rechte",
      align: 'center',
      //tooltip: 'Toggle Status',
      getTip:function( value, meta, rec ) {
        return ((rec.get('readonly')) ? 'Nur Lesen' : 'Lesen + Schreiben')
      },
      getClass: function (val, meta, rec) {
        return ((rec.get('readonly')) ? 'x-fa fa-minus-circle' : 'x-fa fa-plus-circle')
      },
      handler: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        rec.set('readonly', !rec.get('readonly'));
        rec.store.sync();
      },
    },
    {
      text: 'Account',
      dataIndex: 'sortname',
      width: 250,
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
      }],
    },
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
  listeners: {
    select: 'doLoadTransferHistory',
  },
});
