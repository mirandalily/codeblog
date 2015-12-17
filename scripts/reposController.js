var reposController = {};

reposController.index = function() {
  repos.requestRepos(repoView.index);
};
