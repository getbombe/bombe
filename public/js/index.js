require.config({
  paths: {
    jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
    underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
    backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
    'jquery.form': 'http://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.46/jquery.form',
    bootstrap: 'http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min'
  },
  shim: 
  { 
    "jquery": {
        exports: '$'
    },

    "underscore": {
        deps: [],
        exports: "_"
    },
    
    "backbone": {
        deps: ["jquery", "underscore"],
        exports: "Backbone"
    },

    "jquery.form": {
        deps: ["jquery"]
    },

    "bootstrap": {
        deps: ["jquery"]
    }
  }    

});

require([
  'application'
], function(App){
  App.initialize();
});