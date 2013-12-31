// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/BodyView',
  'views/ImportView',
  'views/TreeView',
  'views/OperationView'
], function($, _, Backbone, BodyView, ImportView, TreeView, OperationView) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',

      'import': 'import',
      'tree': 'tree',
      'operation': 'operation',

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
    bodyView = new BodyView();
    importView = new ImportView();
    treeView = new TreeView();
    operationView = new OperationView();

    var currentView = {hide: function(){}}; // dummy

    bodyView.render(); //Load body on all pages

    app_router.on('route:index', function (actions) {
      // TODO: do a legit landing page
      alert("Hello, you've reached the future home of our landing page.")
    });

    app_router.on('route:import', function (actions) {
      // display import stuff
      currentView.hide();

      currentView = importView;
      currentView.render();
    });

    app_router.on('route:tree', function (actions) {
      // display tree stuff
      currentView.hide();

      currentView = treeView;
      console.log(currentView);
      currentView.render();
    });

    app_router.on('route:operation', function (actions) {
      // display operation stuff
      //console.log("jhereee")  <-- wat [Eddie]
      currentView.hide();

      currentView = operationView;
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
