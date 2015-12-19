var reposController = {};

reposController.index = function() {
  $('#about').show();
  $('#stats').hide();
  $('#articles').hide();
  repos.requestAll(reposView.index);
};
