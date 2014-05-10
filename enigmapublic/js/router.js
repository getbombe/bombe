// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'models/SessionModel',
  'views/BodyView',
  'views/LoginView',
  'views/RegisterView',
  'views/ImportView',
  'views/TreeView',
  'views/OperationView',
  'views/SettingsView',
  'views/ProfileView',
  'views/SelectView'
], function($, _, Backbone, SessionModel, BodyView, LoginView, RegisterView, ImportView, TreeView, OperationView, SettingsView, ProfileView, SelectView) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'register',
      'import': 'import',
      'settings': 'settings',
      'profile': 'profile',
      'tree': 'tree',
      'operation': 'operation',
      'select': 'select',
      'login': 'login',
      'register': 'register',
      '*actions': 'unmapped'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;

    // THE session... singular. put all shared stuff in this variable
    var session = new SessionModel;

    // initialize views
    bodyView = new BodyView(session);

    loginView = new LoginView(session);
    registerView = new RegisterView(session);
    profileView = new ProfileView(session);
    settingsView = new SettingsView(session);

    selectView = new SelectView(session);
    importView = new ImportView(session);
    treeView = new TreeView(session);
    operationView = new OperationView(session);

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

    app_router.on('route:login', function (actions) {
      // display import stuff
      switchView(loginView);
    });

    app_router.on('route:register', function (actions) {
      // display import stuff
      switchView(registerView);
    });

    app_router.on('route:import', function (actions) {
      if(!session.isLoggedIn){
        window.location.href = "#/login";
        return;
      }      
 /*     if(!session.currentTree){
        window.location.href = "#/select";
        return;
      }*/

      // display import stuff
      switchView(importView);
    });

    app_router.on('route:settings', function (actions) {
      if(!session.isLoggedIn){
        window.location.href = "#/login";
        return;
      }

      // display import stuff
      switchView(settingsView);
    });

    app_router.on('route:profile', function (actions) {
      if(!session.isLoggedIn){
        window.location.href = "#/login";
        return;
      }

      // display import stuff
      switchView(profileView);
    });

    app_router.on('route:tree', function (actions) {
      if(!session.isLoggedIn){
        window.location.href = "#/login";
        return;
      }      
/*      if(!session.currentTree){
        window.location.href = "#/select";
        return;
      }*/

      // display tree stuff
      switchView(treeView);
    });

    app_router.on('route:select', function (actions) {
      if(!session.isLoggedIn){
        window.location.href = "#/login";
        return;
      }

      // display select stuff
      switchView(selectView);
    });

    app_router.on('route:operation', function (actions) {
      if(!session.isLoggedIn){
        window.location.href = "#/login";
        return;
      }      
      if(!session.currentTree){
        window.location.href = "#/select";
        return;
      }

      // display operation stuff
      switchView(operationView);
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
