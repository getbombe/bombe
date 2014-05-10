// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'models/SessionModel',
  'views/BodyView',
  'views/EnigmaView',
  'views/DashboardView'
], function($, _, Backbone, SessionModel, BodyView, EnigmaView, DashboardView) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'enigma': 'enigma',
      'dashboard': 'dashboard',
      '*actions': 'unmapped'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;

    // THE session... singular. put all shared stuff in this variable
    var session = new SessionModel;

    // initialize views
    bodyView = new BodyView(session);
    enigmaView = new EnigmaView(session);
    dashboardView = new DashboardView(session);

    bodyView.render(); //Load body on all pages

    app_router.on('route:index', function (actions) {
      // TODO: do a legit landing page
      alert("Hello, you've reached the future home of our landing page.")
    });

    var currentView = {hide: function(){}}; // dummy
    var switchView = function(newView){
      currentView.hide();

      currentView = newView;
      currentView.show();
    }


    app_router.on('route:enigma', function (actions) {
      switchView(enigmaView);
    });

    app_router.on('route:dashboard', function (actions) {
      switchView(dashboardView);
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
