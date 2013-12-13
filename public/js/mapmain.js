// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  // enforceDefine: true,
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    localStorage: 'libs/backbone/backbone.localStorage-min',
    pubsub: 'libs/backbone/custom/pubsub',
    templates: '../templates',
    'jquery.mousewheel': 'libs/jquery/jquery-mousewheel-min',
    'jquery.rangeSlider': 'libs/jquery/jQRangeSlider-min',
    'jquery.editRangeSlider': 'libs/jquery/jQEditRangeSlider-min',
    'jquery.ui': 'libs/jqueryui/jqueryui-min',
    'jquery.powertip': 'libs/jquery/jquery-powertip-min',
    'jquery.validate': 'libs/jquery/jquery.validate.min',
    jquerycsv: 'libs/jquery/jquery-csv'
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
    },

    'jquery.mousewheel': {
      deps: ['jquery']
    },

    'jquery.ui': {
      deps: ['jquery']
    },

    'jquery.rangeSlider': {
      deps: ['jquery', 'jquery.ui', 'jquery.mousewheel']
    },

    'jquery.editRangeSlider': {
      deps: ['jquery', 'jquery.ui', 'jquery.mousewheel']
    },

    'jquery.powertip': {
      deps: ['jquery', 'jquery.ui']
    },

    'jquery.validate': {
      deps: ['jquery', 'jquery.ui']
    },
    
    // 'backbone.mediator': {
    //   deps: ['backbone', 'underscore']
    // },
    
    
    // Didn't change, afraid of breaking something you guys made
    'jquerycsv': {
      deps: ['jquery']
      // exports: 'jquerycsv'
    },


  }    

});

define([
  // Load our app module and pass it to our definition function
  'mapapp',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});