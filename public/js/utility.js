/*
 * Bombe utility library
 */

define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone) {
	var utility = {
		ajaxGET: function(dest, data, onDone, onFail, onAlways){
			$.ajax({
				type: "GET",
				url: dest,
				data: data
			})
			.done(onDone)
			.fail(onFail)
			.always(onAlways);
		},

		ajaxPOST: function(dest, data, onDone, onFail, onAlways){
			$.ajax({
				type: "POST",
				url: dest,
				data: data
			})
			.done(onDone)
			.fail(onFail)
			.always(onAlways);
		},

		logAction: function(email, useraction, entity){
			this.ajaxPOST("/log",
						  {
						  	email: email,
						  	useraction: useraction,
						  	entity: entity
						  },
						  function(){},
						  function(){ console.log("Did not log correctly"); },
						  function(){});
		}
	};

	return utility;
});
