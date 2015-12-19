var articleView = {};

articleView.loadTemplate = function() {
  $.get('templates/article.html'), function(data, msg, xhr) {
    articleView.template = Handlebars.compile(data);
    articleView.renderGroup(articles);
  });
};

articleView.renderGroup = function(articleList) {
  $('#articles')
  .fadeIn()
  .append(
    articleList.map( function(a) {
      var temp = new Article(a);
      temp.tagsDropDown();
      return articleView.render(a);
    })
  )
  .siblings().hide();
  Article.truncateArticles();
  Article.filterHandler();
};

articleView.index = function() {
  articleView.loadTemplate(Article.all);
};

articleView.render = function(article) {
  article.daysAgo =
    parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);

  article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
  article.authorSlug = util.slug(article.author);
  article.categorySlug = util.slug(article.category);
  return articleView.template(article);
};

articleView.show = function(articles) {
  articleView.loadTemplate(articles);
};
