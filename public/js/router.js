// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/BodyView'
], function($, _, Backbone, BodyView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index'
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

    bodyView.render(); //Load body on all pages

    app_router.on('route:index', function (actions) {
    });
  };

  return { 
    initialize: initialize
  };
});
