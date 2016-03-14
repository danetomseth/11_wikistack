var express = require('express');
var wikiRouter = express.Router();
var models = require('../models/');
var Page = models.Page; 
var User = models.User; 



wikiRouter.get('/', function(req, res, next) {

	Page.find({}, function(err, pages){
		console.log(pages.tags)
		res.render('index', {
			pages: pages
		})
	})

})




wikiRouter.post('/', function(req, res, next) {
	
  var page = new Page({
    title: req.body.title,
    urlTitle: req.body.title,
    content: req.body.content,
 	tags: req.body.tags
  });

  page.save()
  .then(function(savedPage){
  	// console.log(savedPage.router)
  	//res.redirect('/wiki/'+ page.urlTitle)
  	res.redirect(savedPage.router);
  	//res.json(page)
  })
  .then(null, console.error.bind(console));
})


wikiRouter.get('/add', function(req, res, next) {
	res.render('addpage');
})

wikiRouter.get('/search', function(req, res, next) {
	//var searchTag = req.query.tagSearch;
	console.log('searching', req.query);
// 	Page.findByTag('xyz').exec(function (err, pages) {
//     // whatever we want to do here!
// });
	// Page.find({
 //    // $in matches a set of possibilities
 //    tags: {$in: ['someTag', 'someOtherTag']}
	
	// });

  res.render( 'searchResults', 
   		{ title: 'Search Results',
   		content: 'results', 
   		urlTitle: 'search', 
   		
   	});

  
})

wikiRouter.get('/:urlTitle', function (req, res, next) {
   Page.findOne({ urlTitle: req.params.urlTitle }).exec().then(function(foundPage){
   	// console.log(foundPage);
   	res.render( 'wikipage', 
   		{ title: foundPage.title,
   		content: foundPage.content, 
   		urlTitle: foundPage.urlTitle, 
   		tags: foundPage.tags
   		
   	});
  }).catch(next); // assuming you replaced mpromise
});






module.exports = wikiRouter;