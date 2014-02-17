var mongoose	=	require('mongoose'),
	Schema 		=	mongoose.Schema,
	ObjectId	=	Schema.ObjectId;

var TreeSchema = new Schema({
	id        			: ObjectId,
	// title  			   : { type: String, required: true, enum: ['Mr', 'Mrs', 'Mme', 'Miss'] },
	name				: { type: String, trim: true },
	email      			: { type: String, required: true, trim: true },
	tree				: { type: String, required: true, trim: true },
	created_on  : { type : Date, default : Date.now },
	updated_on  : { type : Date, default : Date.now }
});	

module.exports = mongoose.model('Tree', TreeSchema);
