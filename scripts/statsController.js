var statsController = {};

statsController.index = function() {
  $('#stats').show();
  $('#about').hide();
  $('#articles').hide();
  statsView.render();
};
