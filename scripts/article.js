function Article (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);

  this.body = opts.body || marked(this.markdown);
}

Article.prototype.insertRecord = function(callback) {
  // insert article record into database
  webDB.execute(
    [
      {
        'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, markdown) VALUES (?, ?, ?, ?, ?, ?);',
        'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.markdown],
      }
    ],
    callback
  );
};

Article.prototype.updateRecord = function(callback) {
  //update article record in databse
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
  // Delete article record in database
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
  $.getJSON('/scripts/blogArticles.json', function (data) {
    data.forEach(function(item) {
      var article = new Article(item);
      article.insertRecord();
    });
    next(callback);
  });
};

Article.loadAll = function(callback) {
  var callback = callback || function() {};

  if (Article.all.length === 0) {
    webDB.execute('SELECT * FROM articles ORDER BY publishedOn;',
      function(rows) {
        if (rows.length === 0) {
          // Request data from server, then try loading from db again:
          Article.requestAll(Article.loadAll, callback);
        } else {
          rows.forEach(function(row) {
            Article.all.push(new Article(row));
          });
          callback();
        }
      }
    );
  } else {
    callback();
  }
};

Article.find = function(id, callback) {
  webDB.execute(
    [
      {
        'sql': 'SELECT * FROM articles WHERE id = ?',
        'data': [id]
      }
    ],
    callback
  );
};

Article.truncateTable = function(callback) {
  // Delete all records from given table.
  webDB.execute('DELETE FROM articles;',
    callback
  );
};

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

// articleView.getFilters = function() {
//   Article.allArticles.forEach(function(a) {
//     if (Article.authors.indexOf(a.author) === -1) {
//       Article.authors.push(a.author);
//     }
//     if (Article.categories.indexOf(a.category) === -1) {
//       Article.categories.push(a.category);
//     }
//   });
// };

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