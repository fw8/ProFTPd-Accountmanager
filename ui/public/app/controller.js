Ext.define('app.controller', {
  extend: 'Ext.app.ViewController',

  alias: 'controller.accounts',

  onAdd: function (button, e, options) {
    var me = this, window,
        rootContainer = this.getView().up(),
        vm = this.getViewModel();

    window = Ext.create('Ext.window.Window', {

      title: 'Neuer Account',

      width: 310,

      layout: {
        type: 'fit'
      },

      closable: false,
      modal: true,

      controller: 'accounts',

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
              name: 'userid',
              fieldLabel: 'Name',
              allowBlank: false,
              enableKeyEvents: true,
              maskRe:/[0-9a-z_]/,    // no spaces, no special chars
              // force uniq userid
              validator: function (fieldVal) {
                var store = Ext.StoreMgr.lookup('accounts'),
                  i = store.findExact('userid', fieldVal);
                if (i < 0) {
                  return true;
                } else {
                  return 'Account mit diesem Namen exisitiert bereits';
                }
              },
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
                click: 'onSave'
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

  onSave: function (button, e, options) {
    var window = button.up('window'),
        form = window.down('form'),
        values = form.getValues();

    // get userid and password from form fields

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

  // get the currently selected record from accountsgrid
  getSelectedRecord: function() {
    var grid = this.lookupReference('accountsgrid');
    return grid.getSelectionModel().getSelection();
  },

  onSetPassword: function(grid, rowIndex, colIndex) {
    var rec = grid.getStore().getAt(rowIndex);
  },

});