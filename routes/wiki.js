var express = require('express');
var wikiRouter = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;



wikiRouter.get('/', function(req, res, next) {

    Page.find({}, function(err, pages) {
        res.render('index', {
            pages: pages
        })
    })

})



//Create New page
wikiRouter.post('/', function(req, res, next) {

    var page = new Page({
        title: req.body.title,
        urlTitle: req.body.title,
        content: req.body.content,
        tags: req.body.tags
    });

    page.save()
        .then(function(savedPage) {
            res.redirect(savedPage.router);
        })
        .then(null, console.error.bind(console));
})


//Wiki Page Add
wikiRouter.get('/add', function(req, res, next) {
    res.render('addpage');
})



//Tag Search
wikiRouter.get('/search', function(req, res, next) {
    var searchTag = req.query.tagSearch.split(" ");

    Page.findByTag(searchTag)
    .then(function(foundTags) {
    	console.log(foundTags);
        res.render('searchResults', {
            title: 'Tag Search Results',
            searchTag: searchTag,
            pages: foundTags
        });
    })
})

//Similar Search
wikiRouter.get('/:urlTitle/similar', function(req, res, next){
	Page.findOne({
		urlTitle: req.params.urlTitle
	})
	.exec()
	.then(function(foundPage){	
		//console.log(foundPage)
		console.log(foundPage.tags)
		Page.similar(foundPage.tags)
		.then(

	function(foundTags) {
    	console.log(foundTags);
        res.render('searchResults', {
            title: 'Tag Search Results',
            searchTag: searchTag,
            pages: foundTags
        });
    	})
		// res.render('wikipage', {
	 //        title: foundPage.tags
	 //        // content: foundPage.content,
	 //        // urlTitle: foundPage.urlTitle,
	 //        // tags: foundPage.tags

	 //    });
	})
})

//Wiki Page Route
wikiRouter.get('/:urlTitle', function(req, res, next) {
    Page.findOne({
        urlTitle: req.params.urlTitle
    }).exec().then(function(foundPage) {
        // console.log(foundPage);
        res.render('wikipage', {
            title: foundPage.title,
            content: foundPage.content,
            urlTitle: foundPage.urlTitle,
            tags: foundPage.tags

        });
    }).catch(next); // assuming you replaced mpromise
});

//Exports
module.exports = wikiRouter;