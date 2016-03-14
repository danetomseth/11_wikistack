module.exports = function(swig) {

  var pageLink = function (page) {
    return '<a href="' + page.router + '">' + page.title + '</a>';
  };

  pageLink.safe = true;

  swig.setFilter('pageLink', pageLink);

};