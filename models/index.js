var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var statuses = ['open', 'closed'];

var pageSchema = new mongoose.Schema({
  title:    {type: String, required:true},
  urlTitle: {type: String, required:true},
  content:  {type: String, required:true},
  status:   {type: String, enum: statuses},
  date:     {type: Date, default: Date.now},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags: 	[]
});

pageSchema.statics.findByTag = function(tag){
    return this.find({ 
    	//tags: {$elemMatch: { $eq: tag } }
    	 tags: {
            $in: tag}
    })
    .exec()
}

pageSchema.method.similar = function(page){
	var array = this.find({
		tags: { $in: page.tags}
	});

}

//Pre Hook for Page Creation
pageSchema.pre('save', function(next){

	this.urlTitle = generateUrlTitle(this.title);
	function generateUrlTitle (title) {
	  if (title) {
	    return title.replace(/\s+/g, '_').replace(/\W/g, '');
	  } else {
	    return Math.random().toString(36).substring(2, 7);
	  }
	}
	this.tags = generateTags(this.tags)
	function generateTags(tags){
		var newArray = tags[0].split(' ')

		return newArray
	}
	// console.log(this);

	next();
})

//router
pageSchema.virtual('router').get(function () {
	return '/wiki/'+ this.urlTitle;
})


var userSchema = new mongoose.Schema({
  name: {type: String, required:true},
  email: {type: String, required:true, unique:true},
});


var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

//Exports
module.exports = {
  Page: Page,
  User: User
};




// Page

// title: the page's title
// urlTitle: a url-safe version of the page title, for links
// content: the page content
// date: when the page was authored
// status: if the page is open or closed
// author: which User wrote the page

// User

// name: string name
// email: a unique, identifying email address