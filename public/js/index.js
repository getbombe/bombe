require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    localStorage: 'libs/backbone/backbone.localStorage-min'
  },
  shim: 
  { 
    "underscore": {
        deps: [],
        exports: "_"
    },
    
    "backbone": {
        deps: ["jquery", "underscore"],
        exports: "Backbone"
    }
  }    

});

define([
  'application',
], function(App){
  App.initialize();
});