Ext.define('app.viewmodel', {
  extend: 'Ext.app.ViewModel',

  alias: 'viewmodel.accounts',

  stores: {
    accounts: {
      storeId: 'accounts',
      fields: [
        { name: 'userid' },
        { name: 'enabled', type: 'boolean' },
        { name: 'last_accessed', type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'du', type: 'int' }
      ],
      proxy: {
        type: 'rest',
        url: '/accounts',
        reader: {
          type: 'json',
          rootProperty: 'data'
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
        { name: 'userid' },
        { name: 'client_ip' },
        { name: 'protocol' },
        { name: 'command' },
        { name: 'filename' },
        { name: 'bytes', type: 'int' },
        { name: 'transfer_date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
      ],
      leadingBufferZone: 300,
      pageSize: 100,
      autoLoad: false,
      proxy: {
        type: 'ajax',
        url: '/accounts/0/history/transfer',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'total'
        },
      }
    }
  }

});
