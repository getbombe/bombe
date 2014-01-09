var mongoose	=	require('mongoose'),
	Schema 		=	mongoose.Schema,
	ObjectId	=	Schema.ObjectId;

var LogSchema = new Schema({
	id        			: ObjectId,
	// title  			   : { type: String, required: true, enum: ['Mr', 'Mrs', 'Mme', 'Miss'] },
	email      			: { type: String, required: true, trim: true },
	useraction			: { type: String, required: true, trim: true },
	entity	 			: { type: String, trim: true },
	created_on  : { type : Date, default : Date.now },
	updated_on  : { type : Date, default : Date.now }
});	

module.exports = mongoose.model('Log', LogSchema);
