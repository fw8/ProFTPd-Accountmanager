Ext.define('app.viewmodel', {
  extend: 'Ext.app.ViewModel',

  alias: 'viewmodel.accounts',

  stores: {
    accounts: {
      storeId: 'accounts',
      fields: [
        { name: 'id' },
        { name: 'enabled', type: 'boolean' },
        { name: 'count', type: 'int' },
        { name: 'last_accessed', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'du', type: 'int' },
        { name: 'df', type: 'int' },
        { name: 'deleted', type: 'bool' },
        { name: 'usage',
          type: 'float',
          convert: function(val,row) {
            return row.data.du / row.data.df;
          }
        },
      ],
      filters: {
        property: 'deleted',
        value: false,
        operator: '=='
      },
      proxy: {
        type: 'rest',
        url: '/accounts',
        reader: {
          type: 'json',
          rootProperty: 'data',
        },
        writer : {
          type: 'json',
          writeAllFields: true
        },
      },
      autoLoad: true,
    },

    transfer_history: {
      storeId: 'transfer_history',
      fields: [
        { name: 'id' },
        { name: 'client_ip' },
        { name: 'protocol' },
        { name: 'command' },
        { name: 'filename' },
        { name: 'bytes', type: 'int' },
        { name: 'transfer_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
      ],
      buffered: true,
      leadingBufferZone: 100,
      pageSize: 100,
      remoteSort: true,
      autoLoad: false,
      proxy: {
        type: 'ajax',
        url: 'none',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'total'
        },
      }
    }
  }

});
