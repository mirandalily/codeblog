var reposView = {};

reposView.index = function() {
  reposView.ui();
  var _append = function(repo) {
    $('#about ul').append(reposView.render(repo));
  };
  repos.all.forEach(_append);
};

repoView.render = function(repo) {
  return $('<li>')
    .text(repo.full_name);
};

repoView.ui = function() {
  var $about = $('#about');
  var $ul = $about.find('ul');

  $ul.empty();
  $about.fadeIn().siblings().hide();
};
