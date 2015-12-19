function Article (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);

  this.body = opts.body || marked(this.markdown);
}

Article.prototype.tagsDropDown = function() {
  var $categoryMenu = $('.catMenuItem').clone();
  $categoryMenu.removeAttr('class');
  $categoryMenu.attr('value', this.category);
  $categoryMenu.text(this.category);
  if ($('#catFilter select').find('option[value="' + this.category + '"]').length === 0) {
    $('#catFilter select').append($categoryMenu);
  }
  var $authorMenu = $('.authMenuItem').clone();
  $authorMenu.removeAttr('class');
  $authorMenu.attr('value', this.author);
  $authorMenu.text(this.author);
  if ($('#authFilter select').find('option[value="' + this.author + '"]').length === 0) {
    $('#authFilter select').append($authorMenu);
  }
};


Article.prototype.insertRecord = function(callback) {
  webDB.execute(
    [
      {
        'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, markdown) VALUES (?, ?, ?, ?, ?, ?);',
        'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.markdown]
      }
    ],
    callback
  );
};

Article.prototype.updateRecord = function(callback) {
  webDB.execute(
    [
      {
        'sql': 'UPDATE articles SET title = ?, author = ?, authorUrl = ?, category = ?, publishedOn = ?, markdown = ? WHERE id = ?;',
        'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.markdown, this.id]
      }
    ],
    callback
  );
};

Article.prototype.deleteRecord = function(callback) {
  webDB.execute(
    [
      {
        'sql': 'DELETE FROM articles WHERE id = ?;',
        'data': [this.id]
      }
    ],
    callback
  );
};

Article.all = [];

Article.requestAll = function(next, callback) {
  $.getJSON('scripts/blogArticles.json', function (data) {
    data.forEach(function(item) {
      var article = new Article(item);
      article.insertRecord();
    });
    next(callback);
  });
};

Article.findByCategory = function(category, callback) {
  webDB.execute(
    [
      {
        'sql': 'SELECT * FROM articles WHERE category = ?',
        'data': [category]
      }
    ],
    callback
  );
};

Article.loadAll = function(callback) {
  var callback = callback || function() {};

  if (Article.all.length === 0) {
    webDB.execute('SELECT * FROM articles ORDER BY publishedOn;',
      function(rows) {
        if (rows.length === 0) {
          Article.requestAll(Article.loadAll, callback);
        } else {
          rows.forEach(function(row) {
            Article.all.push(new Article(row));
          });
          Article.hamburgerMenu();
          callback();
        }
      }
    );
  } else {
    callback();
  }
};

Article.truncateArticles = function() {
  $('.postBody h2:not(:first-child)').hide();
  $('.postBody p:not(:nth-child(2))').hide();
  $('.read-on').on('click', function(event) {
    event.preventDefault();
    $(this).siblings('.postBody').find('h2:not(:first-child)').toggle();
    $(this).siblings('.postBody').find('p:not(:nth-child(2))').toggle();
  });
};

Article.filterHandler = function() {
  $('select[id="category"]').change(function(e){
    $('#author').find('option:first').attr('selected', 'selected');
    $('main').find('article').show();
    if ($(this).val() !== 'none'){
      console.log($(this).val());

      page('/category/' + $(this).val());

      e.preventDefault();
    }
  });
  $('select[id="author"]').change(function(){
    $('#category').find('option:first').attr('selected', 'selected');
    $('main').find('article').show();
    if ($(this).val() !== 'none'){
      $('article:not(:contains(' + $(this).val() + '))').hide();
    }
  });
};

Article.hamburgerMenu = function() {
  var menu = function() {
    $( '.cross' ).hide();
    $( '.hamburger' ).click(function() {
      $( '.nav' ).slideToggle( 'slow', function() {
        $( '.hamburger' ).hide();
        $( '.cross' ).show();
      });
    });
    $( '.cross' ).click(function() {
      $( '.nav' ).slideToggle( 'slow', function() {
        $( '.cross' ).hide();
        $( '.hamburger' ).show();
      });
    });
  };
};
