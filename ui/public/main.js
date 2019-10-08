Ext.require([
  'app.controller',
  'app.viewmodel',
  'app.views.accountspanel',
  'app.views.accountsgrid',
]);

Ext.application({
  name: 'ProFTPd-Accountmanager',
  appFolder: 'app',

  launch: function () {
    main = Ext.create('Ext.container.Container', {
      padding: '20 20 20 20',
      plugins: 'viewport',

      items: [{
        xtype: 'accountspanel',
      }]
    });

  // Reload store every minute
  var store = main.down('accountspanel').getViewModel().getStore('accounts');
  var runner = new Ext.util.TaskRunner(),
    task = runner.start({
      run: function () {
        store.reload();
        console.log("store reloaded");
      },
      interval: 60000
    });
  }
});
