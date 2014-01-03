define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var SessionModel = Backbone.Model.extend({
  		defaults : {
        isLoggedIn: false,
        email: null,
        apiKey: null,
      },

      initialize: function( options ) {
        // none so far
  		}
    });

  	return SessionModel;
});
