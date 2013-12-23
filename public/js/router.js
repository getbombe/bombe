// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/BodyView',
  'views/ImportView'
], function($, _, Backbone, BodyView, ImportView) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'import': 'import',

      '*actions': 'unmapped'
    }
  });
  
  var _trackPageview = function() {
    var url;
    url = Backbone.history.getFragment();
    return _gaq.push(['_trackPageview', "/" + url]);
  };

  var initialize = function(){
    var app_router = new AppRouter;

    // initialize views
    var bodyView = new BodyView();

    var currentView;

    bodyView.render(); //Load body on all pages

    app_router.on('route:index', function (actions) {
      // TODO: do a legit landing page
      alert("Hello, you've reached the future home of our landing page.")
    });

    app_router.on('route:import', function (actions) {
      // display import stuff
      currentView = new ImportView();
      currentView.render();
    });


    app_router.on('route:unmapped', function (actions) {
      // TODO: do a legit landing page
      alert("404: page not found.");
    });
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };
});
