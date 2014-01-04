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
		}
	};

	return utility;
});
