var blog = {};
blog.rawData = [];

blog.loadArticles = function() {
  $.get('templates/article.html'), function(data, msg, xhr) {
    Article.prototype.handlebarTest = Handlebars.compile(data);
    $.ajax({
      type: 'HEAD',
      url: 'scripts/hackerIpsum.json',
      success: blog.fetchArticles
    });
  };
};

blog.fetchArticles = function(data, msg, xhr) {
  var eTag = xhr.getResponseHeader('eTag');
  if (typeof localStorage.articlesEtag == 'undefined' || localStorage.articlesEtag != eTag) {
    localStorage.articlesEtag=eTag;
} else {
  webDB.execute('DROP TABLE articles;', function() {
      webDB.setupTables();
      webDB.importArticlesFrom('scripts/hackerIpsum.json');
    });
  }
};

blog.exportJSON = function() {
  $('#export-field').show();
  var output = '';
  blog.rawData.forEach(function(article) {
    output += JSON.stringify(article) + ',\n';
  });
  $('#article-json').val('[' + output + '{"markdown":""}]');
};
blog.fetchFromDB = function(callback) {
  callback = callback || function() {};
  webDB.execute(
    'SELECT * FROM articles ORDER BY publishedOn DESC;',
    function (resultArray) {
      resultArray.forEach(function(ele) {
        var temp = new Article(ele);
        blog.rawData.push(temp);
        temp.toHTML();
        temp.tagsDropDown();
      });
      callback();
    });
};
blog.clearAndFetch = function () {
  blog.rawData = [];
  blog.fetchFromDB(blog.exportJSON);
};
blog.buildArticle = function() {
  return new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    markdown: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });
};
blog.buildPreview = function() {
  $('#new-form').change(function() {
    var article = blog.buildArticle();
    $('#articles').empty().append(article.toHTML());
    $('pre code').each(function (i, block){
      hljs.highlightBlock(block);
    });
  });
};

blog.fillFormWithArticle = function (a) {
  var checked = a.publishedOn ? true : false;
  $('#articles').empty();
  $('#article-title').val(a.title);
  $('#article-author').val(a.author);
  $('#article-author-url').val(a.authorUrl);
  $('#article-category').val(a.category);
  $('#article-body').val(a.markdown);
  $('#article-published').attr('checked', checked);
  blog.buildPreview();
};

blog.loadArticleById = function (id) {
  webDB.execute(
    'SELECT * FROM articles WHERE id=' + id +';'
    ,
    function (resultArray) {
      if (resultArray.length === 1) {
        blog.fillFormWithArticle(resultArray[0]);
      }
    }
  );
};

blog.checkForEditArticle = function () {
  if (util.getParameterByKey('id')) {
    var id = util.getParameterByKey('id');
    blog.loadArticleById(id);
    $('#add-article-btn').hide();
    $('#update-article-btn').show().data('article-id', id);
    $('#delete-article-btn').show().data('article-id', id);
  } else {
    console.log('No article to edit.');
  }
};
blog.initArticleEditorPage = function() {
  $.get('templates/article.html', function(data, msg, xhr) {
    Article.prototype.handlebarTest = Handlebars.compile(data);
  });
  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });
  blog.checkForEditArticle();
};

blog.initNewArticlePage = function() {
  $.get('templates/article.html', function(data, msg, xhr) {
    Article.prototype.handlebarTest = Handlebars.compile(data);
  });

  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });
  blog.buildPreview();
};

blog.handleAddButton = function () {
  $('#add-article-btn').on('click', function (e) {
    var article = blog.buildArticle();
    article.insertRecord(article);
  });
};

blog.handleUpdateButton = function () {
  $('#update-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    var article = blog.buildArticle();
    article.id = id;
    article.updateRecord();
    blog.clearAndFetch();
  });
};

blog.handleDeleteButton = function () {
  $('#delete-article-btn').on('click', function () {
    var id = $(this).data('article-id');
    var article = blog.buildArticle();
    article.id = id;
    article.deleteRecord(blog.clearAndFetch);
    blog.clearNewForm();
  });
};
