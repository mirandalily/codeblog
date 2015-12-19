var repos = {};

repos.all = [];

repos.requestAll= function(callback) {
  $.ajax({
    url: '/github/users/mirandalily/repos',
    type: 'GET',
    success: function(data, message, xhr) {
      repos.all = data;
    }
  }).done(callback);
};
