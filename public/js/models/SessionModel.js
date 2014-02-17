define([
  'underscore',
  'backbone',
  'utility'
], function(_, Backbone, Util) {

  var SessionModel = Backbone.Model.extend({
      graphData: [],
      currentTree: false,
      treeKeys: [],
      treeNames: [],

  		defaults : {
        isLoggedIn: false,
        email: null,
        apiKey: null,
        tree: null,
        newNode: null,
        activeNode: null,
      },

      initialize: function( options ) {
        // none so far
  		},

      // TODO: make this not async
      getGraphData: function(key) {
        if (this.graphData[key]) return this.graphData[key]

        var that = this;
        var ret;
        $.ajax({
          type: "POST",
          url: "/data/load",
          async: false,
          data:
            { email: that.email, 
              key: key },
        })
        .done(function(data){
          that.graphData[key] = data.graphData;
          ret = that.graphData[key];
        })
        .fail(function() { console.log("Failed to load key: " + key); return []; });
        return ret;
      },

      saveGraphData: function(data) {
        var that = this;
        var ret;
        $.ajax({
          type: "POST",
          url: "/data/save",
          async: false,
          data:
            { email: that.email,
              data: data
            },
        })
        .done(function(returnData){
          that.graphData[returnData.key] = data;
          ret = returnData.key;
        })
        .fail(function(err) { console.log("Failed to save data: " + err); ret = -1; });
        return ret;
      },

      // tree getters and modifiers
      getTree: function(key) {
        var that = this;
        var ret;
        $.ajax({
          type: "POST",
          url: "/tree/get",
          async: false,
          data:
            { 
              key:key
            },
        })
        .done(function(returnData){
          // TODO: check db error
          ret = returnData.tree;
        })
        .fail(function(err) { console.log("Failed to get tree: " + err); ret = -1; });
        return ret;
      }
    });

  	return SessionModel;
});
