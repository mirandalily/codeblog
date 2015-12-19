var statsView = {};

statsView.render = function() {
  var fromLS = Article.all;
  $('#stats').empty().append('Number of articles: ' + fromLS.length);
  $('#stats').append('<br/>Number of authors: ' + uniqueAuthors(fromLS).length);
  $('#stats').append('<br/>Number of categories: ' + uniqueCategories(fromLS).length);
  $('#stats').append('<br/>Number of words: ' + wordCount(fromLS));
  $('#stats').append('<br/>Average characters per word: ' + averageWordLength(fromLS));
  $('#stats').append('<br/>Average words per post per author: ' + getPostsByAuthor(fromLS));
};
