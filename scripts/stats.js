function pluck(property, collection) {
  return collection.map(function(e){return e[property];});
}
function uniqueAuthors(collection) {
  var seen = [];
  var all = pluck('author', collection);
  all.forEach(function(e) {
    if (seen.indexOf(e) === -1) {seen.push(e);}
  });
  return seen;
}
function uniqueCategories(collection) {
  var length = collection ?collection.length : 0;
  var all = pluck('category', collection);
  if (!length) {return [];}
  var seen = [];
  all.forEach(function(e) {
    if (seen.indexOf(e) === -1) {seen.push(e);}
  });
  return seen;
}
function wordCount(collection) {
  var all = pluck('markdown', collection);
  var count = [];
  all.forEach(function(e) {
    var div = document.createElement('div');
    div.innerHTML = e;
    var text = div.textContent || div.innerText || '';
    count.push(text.split(' ').length);
  });
  var total = count.reduce(function(a,b) {return a + b;});
  return total;
}
function averageWordLength(collection) {
  var all = pluck('markdown', collection);
  var postWordCount = [];
  var count = [];
  var avgs = [];
  all.forEach(function(e) {
    var div = document.createElement('div');
    div.innerHTML = e;
    var text = div.textContent || div.innerText || '';
    count.push(text.split(' '));
  });

  count.forEach(function(e) {
    e.forEach(function(f) {
      postWordCount.push(f.length);
    });
  });
  var num = postWordCount.length;
  var sum = postWordCount.reduce(function(a,b) {return a + b;});

  return sum/num;
}
function getPostsByAuthor(collection) {
  var currentAuthor;
  var uniqueAuthors = [];
  var authors = [];
  var objects = [];
  var y = [];
  var msg = '';
  collection.forEach(function(e) {
    var temp = [];
    var x = authors.indexOf(e.author);
    temp.push(e);
    if (authors.indexOf(e.author) === -1) {
      authors.push(e.author);
      objects.push(temp);
    }
    else {objects[x].push(e);}
  });
  var i = 0;
  objects.forEach(function(f) {
    y = wordCount(f)/f.length;
    msg += '<br/>' + authors[i] + ' averages ' + y + ' words per post!';
    i++;
  });
  return msg;
}
