var mongoose	=	require('mongoose'),
	Schema 		=	mongoose.Schema,
	ObjectId	=	Schema.ObjectId;

var UserSchema = new Schema({
	id        			: ObjectId,
	// title  			   : { type: String, required: true, enum: ['Mr', 'Mrs', 'Mme', 'Miss'] },
	lastname  			: { type: String, required: true, trim: true},
	firstname 			: { type: String, required: true, trim: true},
	email      			: { type: String, required: true, trim: true, index: { unique: true, sparse: true } },
	institution			: String,
	password			: { type: String, required: true},
	created_on  : { type : Date, default : Date.now },
	updated_on  : { type : Date, default : Date.now }
});	

module.exports = mongoose.model('User', UserSchema);
