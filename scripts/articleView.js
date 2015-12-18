var articleView = {};

articleView.renderGroup = function(articleList) {
  $('#articles')
  .fadeIn()
  .append(
    articleList.map( function(a) {
      return articleView.render(a);
    })
  )
  .siblings().hide();
};

articleView.render = function(article) {
  article.daysAgo =
    parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);

  article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
  article.authorSlug = util.slug(article.author);
  article.categorySlug = util.slug(article.category);

  return articleView.template(article);
};

articleView.index = function() {
  articleView.renderGroup(Article.all);
};

articleView.show = function(articles) {
  articleView.renderGroup(articles);
};

articleView.populateFilters = function() {
  Article.authors.forEach(function(a) {
    var $populateAuthors = $('#authoroption').clone;
    $populateAuthors.removeAttr('id');
    $populateAuthors.text(pop);
    $('#authorfilter').append($populateAuthors);
  });
  Article.categories.forEach(function(a) {
    var $populateCategories = $('#categoryoption').clone();
    $populateCategories.removeAttr('id');
    $populateCategories.text(a);
    $('#categoryfilter').append($populateCategories);
  });
};


articleView.filterArticles = function() {
  $('#authorfilter').on('change', function() {
    $selection = this.value;
    $('#categoryfilter').prop('selectedIndex', 0);
    $('.post').each(function() {
      var data = $(this).data('author');
      if ($selection == 'Filter by author') {
        $('.post').show();
      } else if (data != $selection) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  });

  $('#categoryfilter').on('change', function() {
    $selection = this.value;
    $('#authorfilter').prop('selectedIndex', 0);
    $('.post').each(function() {
      var data = $(this).data('category');
      if ($selection == 'Filter by category') {
        $('.post').show();
      } else if (data != $selection) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  });
};

$(document).ready(function() {
  menu();
  populateFilters();
});
