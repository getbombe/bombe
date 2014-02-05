var mongoose	=	require('mongoose'),
	Schema 		=	mongoose.Schema,
	ObjectId	=	Schema.ObjectId;

var GraphDataSchema = new Schema({
	id        		: ObjectId,

	email      		: { type: String, required: true, trim: true },

	dataX 			: [ Number ],
	dataY 			: [ Number ],

	unitX 			: { type: String, required: true, trim: true, default : "Units" },
	unitY 			: { type: String, required: true, trim: true, default : "Units" },

	labelX 			: { type: String, required: true, trim: true, default : "X-Data" },
	labelY 			: { type: String, required: true, trim: true, default : "Y-Data" },

	created_on 		: { type : Date, default : Date.now },
	updated_on  	: { type : Date, default : Date.now }
});	

module.exports = mongoose.model('GraphData', GraphDataSchema);
