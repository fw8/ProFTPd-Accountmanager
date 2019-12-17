Ext.define('app.views.newsubaccountwindow', {
  extend: 'Ext.window.Window',
  xtype: 'newsubaccountwindow',

  title: 'Neuer Unteraccount',

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
        labelWidth: 100
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
          parents: {
            fields: [ { name: 'id', parent: 'parent' } ],
            filters: [
              { property: 'parent', operator: '==', value: null },
              { property: 'deleted', operator: '==', value: false },
            ],
            proxy: {
              type: 'ajax',
              url: '/accounts?p',
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
          xtype: 'combobox',
          name: 'parent',
          fieldLabel: 'Übergeordneter Account',
          valueField: 'id',
          displayField: 'id',
          editable: false,
          allowBlank: false,
          bind: {
            store: '{parents}'
          },
        },
        {
          name: 'id',
          fieldLabel: 'Name',
          allowBlank: false,
          enableKeyEvents: true,
          maskRe:/[0-9A-Za-z_]/,    // no spaces, no special chars
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
