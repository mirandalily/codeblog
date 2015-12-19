var reposView = {};

reposView.index = function() {
  reposView.ui();
  console.log(repos);
  var _append = function(repo) {
    $('#about ul').append(reposView.render(repo));
  };
  repos.all.forEach(_append);
};

reposView.render = function(repo) {
  return $('<li>').text(repo.full_name);
};

reposView.ui = function() {
  var $about = $('#about');
  var $ul = $about.find('ul');

  $ul.empty();
  $about.fadeIn().siblings().hide();
};
