define([
  'underscore',
  'backbone',
  'utility'
], function(_, Backbone, Util) {

  var SessionModel = Backbone.Model.extend({
  		defaults : {
        isLoggedIn: false,
        email: null,
        apiKey: null,
        tree: null,
        newNode: null,
        activeNode: null,

        graphData: []
      },

      initialize: function( options ) {
        // none so far
  		},

      getGraphData: function(key, callback) {
          if (this.graphData[key]) return this.graphData[key]

          var that = this;
          Util.ajaxPOST("/data/load",
                        { email: that.email, 
                          key: key },
                        function(data){
                          that.graphData[key] = data.graphData;
                          callback(key);
                        },
                        function(err){ console.log("Error loading graph: " + err); },
                        function(){});
      },

      saveTempData: function(data, treeLocation) {
        var tempId = Math.floor(Math.random() * (100000000 -  + 1)) + 1;
        this.graphData[tempId] = data;
        treeLocation.graphid = tempId;
      },

      saveGraphData: function(data, treeLocation) {
        // ONLY CALL THIS AFTER CALLING saveTempData
        var that = this;
        Util.ajaxPOST("/data/save",
                      { email: that.email,
                        data: data
                      },
                      function(returnData){
                        var permId = returnData.id;
                        that.graphData[permId] = data;
                        treeLocation.graphid = permId;
                      },
                      function(err){ console.log("Error saving graph: " + err); },
                      function(){});
      }
    });

  	return SessionModel;
});
