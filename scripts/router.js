page('/', articlesController.index);
page('/about', reposController.index);
page('/stats/', statsController.index);
page('/category/:category',
  articlesController.category,
  articlesController.show);
page.start();
