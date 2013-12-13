// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/frame/HeaderView',
  'views/NeighborhoodListView',
  'views/MapView',
  'views/BrowseView',
  'views/InitialProfileView',
  'views/compareTableView',
  'views/detailView',
  'pubsub'
], function($, _, Backbone, HeaderView, NeighborhoodListView, MapView, BrowseView, InitialProfileView, compareHoodsView, HoodDetailView, Pubsub) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'listNeighborhoods': 'listNeighborhoods',
      //'compareHoods': 'compareHoods',
      'browse': 'showBrowse',
      'profile': 'showInitialProfile',
      'profile/:city': 'showInitialProfile',
      'map': 'showMap',
      //'detail':'showDetail',
      // Default
      '*actions': 'defaultAction'
    }
  });
  
  var _trackPageview = function() {
    var url;
    url = Backbone.history.getFragment();
    return _gaq.push(['_trackPageview', "/" + url]);
  };

  var initialize = function(){
    var app_router = new AppRouter;

    // Initialize all views
    var initialProfileView = new InitialProfileView();
    var headerView = new HeaderView(initialProfileView.model); 
    var neighborhoodListView = new NeighborhoodListView();
    var browseView = new BrowseView();
    // var mapView = new MapView();
    var compareTableView = new compareHoodsView();
    
    headerView.render(); //Load header on all pages

    // debugging feature to dump out the neighborhoods
    // go to http://localhost:3000/backbone/map.html#listNeighborhoods for dump
    app_router.on('route:listNeighborhoods', function (actions) {
      neighborhoodListView.render();
    });

    app_router.on('route:showBrowse', function (actions) {
      var a = initialProfileView.getSubview('priorityAttributesListView'); //get all subviews to pass to browse
      var b = initialProfileView.getSubview('priorityCirclesGroupView'); //get all subviews to pass to browse

      if (typeof a === "undefined") {
        // console.log('ERROR: priorityAttributesListView undefined');
        app_router.navigate("/#profile/" + initialProfileView.model.get('city'), {trigger: true, replace: true});

      }
      else if (typeof b === "undefined"){
        // console.log('ERROR: priorityCirclesGroupView undefined');
        app_router.navigate("/#profile/" + initialProfileView.model.get('city'), {trigger: true, replace: true});
      }
      else {
        if(initialProfileView.mandatoryFieldsFilledOut(initialProfileView.model, a)){
         $("#mandatoryfielderror").hide();
          Pubsub.trigger('pageChanged', 'browse');
          browseView.render(a, b, initialProfileView.model);
        } else {
          app_router.navigate("/", {trigger: false});
         $("#mandatoryfielderror").show();
        }
      }
      // console.log(initialProfileView.model);
    });

    app_router.on('route:showInitialProfile', function (actions) {
      // alert("RouterInitProfile: " + browseView.options.renderedBefore);
      console.log('IVP Model');
      console.log(initialProfileView.model);
      console.log('ACtionc');
      console.log(actions);
      Pubsub.trigger('pageChanged', 'profile', actions);
      initialProfileView.model.set('city', actions);
      initialProfileView.render(browseView.options.renderedBefore);

    });

    app_router.on('route:showMap', function (actions) {
    });

    //app_router.on('route:compareHoods', function (actions) {
    //  compareTableView.render(initialProfileView.model);
    //});

    //show neighbourhood detail
    //app_router.on('route:showDetail', function (actions) {
    //  var hoodDetailView = new HoodDetailView();
     // hoodDetailView.render();
    //});

    app_router.on('route:defaultAction', function (actions) {
      // TODO: should put 404 here
          // console.log(window.webroot);
        // alert("RouterDefault: " + browseView.options.renderedBefore);
        console.log('IVP DEF Model');
      console.log(initialProfileView.model);
      console.log('ACtionc');
      console.log(actions);
      app_router.navigate("profile", { trigger: true });   
      // Pubsub.trigger('pageChanged', 'profile');
      // initialProfileView.render(browseView.options.renderedBefore);

    });

    // http://stackoverflow.com/questions/9368151/define-a-base-url-in-backbone-js-router
    Backbone.history.start();
    // Backbone.history.start({pushState: true, root: "/public/search/"})
    // 
    
    // return this.bind('route', this._trackPageview);
  };

  return { 
    initialize: initialize
  };
});
