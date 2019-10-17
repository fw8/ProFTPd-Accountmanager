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
  },

});
