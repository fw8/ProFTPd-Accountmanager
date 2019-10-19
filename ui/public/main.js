Ext.require([
  'app.controller',
  'app.viewmodel',
  'app.views.accountspanel',
  'app.views.accountsgrid',
  'app.views.transferhistorygrid',
]);

// Prototype to convert a number to a readable string respecting the new international standards.
// Usage:
// console.log((186457865).fileSize()); // default IEC (power 1024)
// console.log((186457865).fileSize(1)); //1,true for SI (power 1000)
Object.defineProperty(Number.prototype,'fileSize',{value:function(a,b,c,d){
  return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
  d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
  +' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
 },writable:false,enumerable:false});

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
