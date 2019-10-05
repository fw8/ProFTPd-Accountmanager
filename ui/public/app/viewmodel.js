Ext.define('app.viewmodel', {
  extend: 'Ext.app.ViewModel',

  alias: 'viewmodel.accounts',

  stores: {
    accounts: {
      storeId: 'accounts',
      fields: [
        { name: 'userid' },
        { name: 'status' },
        { name: 'last_accessed', type: 'date', dateFormat: 'Y-m-d H:i:s' }
      ],
      proxy: {
        type: 'rest',
        url: '/accounts',
        reader: {
          type: 'json',
          rootProperty: 'data'
        },
      },
      autoLoad: true,
    },
  },

});
