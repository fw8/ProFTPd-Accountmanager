Ext.define('app.controller', {
  extend: 'Ext.app.ViewController',

  alias: 'controller.accounts',

  onAccountAdd: function (button, e, options) {
    var me = this, window,
        rootContainer = this.getView().up(),
        vm = this.getViewModel();

    window = Ext.create('app.views.newaccountwindow', {
    });

    window.show();
  },

  onSubAccountAdd: function (button, e, options) {
    var me = this, window,
        rootContainer = this.getView().up(),
        vm = this.getViewModel();

    window = Ext.create('app.views.newsubaccountwindow', {
    });

    window.show();
  },

  onAccountAddSave: function (button, e, options) {
    var window = button.up('window'),
        form = window.down('form'),
        values = form.getValues();

    // fix value from checkbox
    values.readonly = (values.readonly) ? true : false;

    // get id and password from form fields

    if (form.isValid()) {
      Ext.Ajax.request({
        url: '/accounts',
        method: "POST",
        params: values,

        success: function (response, opts) {
          var store = Ext.StoreMgr.lookup('accounts');
          store.reload();
          Ext.destroy(window);
        },
        failure: function (response, opts) {
          console.log('server-side failure with status code ' + response.status);
          Ext.destroy(window);
        }

      });
    }

    window.hide();
  },


  onAccountRemove: function(grid, rowIndex, colIndex) {
    var me = this,
        rec = grid.getStore().getAt(rowIndex);
    Ext.Msg.show({
      title: 'Löschen?',
      message: 'Soll der Account wirklich gelöscht werden?',
      buttons: Ext.Msg.YESNO,
      icon: Ext.Msg.QUESTION,
      fn: function (buttonId) {
        if (buttonId == 'yes') {
          var transfer_store = me.getViewModel().getStore('transfer_history');
          transfer_store.clearData();
          transfer_store.getProxy().setUrl('none');
          rec.set('deleted', true);
          //rec.store.remove(rec);
          rec.store.sync();
          //App.util.Util.showToast('Kontakt erfolgreich gelöscht.');
        }
      }
    });
  },


  // get the currently selected record from accountsgrid
  getSelectedRecord: function() {
    var grid = this.lookupReference('accountsgrid');
    return grid.getSelectionModel().getSelection();
  },


  onSetPassword: function(grid, rowIndex, colIndex) {
    var me = this,
        rec = grid.getStore().getAt(rowIndex),
        window,
        rootContainer = this.getView().up(),
        vm = this.getViewModel();

    window = Ext.create('Ext.window.Window', {

      title: 'Neues Passwort',

      width: 310,

      layout: {
        type: 'fit'
      },

      closable: false,
      modal: true,

      controller: 'accounts',

      viewModel: {
        data: {
          accountId: rec.id,
        }
      },

      items: [
        {
          xtype: 'form',
          bodyPadding: 5,

          defaults: {
            xtype: 'textfield',
            anchor: '100%',
            msgTarget: 'side',
            labelWidth: 80
          },
          items: [
            {
              xtype: 'displayfield',
              //name: 'id',
              fieldLabel: 'Account',
              bind: '{accountId}',
            },
            {
              xtype: 'hiddenfield',
              name: 'id',
              bind: '{accountId}',
            },
            {
              fieldLabel: 'Password',
              name: 'passwd',
              allowBlank: false,
              maskRe:/[^ ]/,  // everything but blanks
              inputType : 'password',
            },
          ]
        }
      ],
      dockedItems: [
        {
          xtype: 'toolbar',
          dock: 'bottom',
          ui: 'footer',
          layout: {
            pack: 'end',
            type: 'hbox'
          },
          items: [
            {
              xtype: 'button',
              text: 'Speichern',
              formBind: true,
              listeners: {
                click: 'onSetPasswordSave'
              }
            },
            {
              xtype: 'button',
              text: 'Abbrechen',
              listeners: {
                click: function (button, e, options) {
                  Ext.destroy(button.up('window'));
                },
              }
            }
          ]
        }
      ],
    });

    window.show();
  },

  onSetPasswordSave: function (button, e, options) {
    var window = button.up('window'),
        form = window.down('form'),
        values = form.getValues();

    // get id and password from form fields

    if (form.isValid()) {
      Ext.Ajax.request({
        url: '/accounts/'+values.id,
        method: "POST",
        params: values,

        success: function (response, opts) {
          var store = Ext.StoreMgr.lookup('accounts');
          store.reload();
          Ext.destroy(window);
        },
        failure: function (response, opts) {
          console.log('server-side failure with status code ' + response.status);
          Ext.destroy(window);
        }

      });
    }

    window.hide();
  },

  doLoadTransferHistory: function(grid, rec, colIndex) {
    var store = this.getViewModel().getStore('transfer_history');
    store.getProxy().url = '/accounts/'+rec.id+'/history/transfer';
    store.reload();
    this.view.down('transferhistorygrid').setCollapsed(false);
  },
});