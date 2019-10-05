Ext.require([
  'app.controller',
  'app.viewmodel',
  'app.views.accountspanel',
  'app.views.accountsgrid',
]);

Ext.onReady(function () {
  var main;

  main = Ext.create('Ext.container.Container', {
    padding: '20 20 20 20',
    layout: 'fit',
    renderTo: document.body,
    layout: {
      type: 'vbox',
      align: 'stretch'
    },
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

});
