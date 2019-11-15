Ext.define('app.views.newaccountwindow', {
  extend: 'Ext.window.Window',
  xtype: 'newaccountwindow',

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

      viewModel: {
        stores: {
          accounts: {
            fields: [ { name: 'id' } ],
            proxy: {
              type: 'ajax',
              url: '/accounts',
              reader: {
                type: 'json',
                rootProperty: 'data'
              },
            },
            autoLoad: true
          },
        },
      },

      items: [
        {
          name: 'id',
          fieldLabel: 'Name',
          allowBlank: false,
          enableKeyEvents: true,
          maskRe:/[0-9a-z_]/,    // no spaces, no special chars
          // force uniq id
          validator: function (fieldVal) {
            var store = this.up().getViewModel().getStore('accounts');
            i = store.findExact('id', fieldVal);
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
        {
          xtype: 'checkboxfield',
          fieldLabel: 'Readonly',
          name: 'readonly',
        }
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
            click: 'onAccountAddSave'
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
