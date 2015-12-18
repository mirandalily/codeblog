page('/', articlesController.index);
page('/about', reposController.index);
page('/category/:category',
  articlesController.template,
  articlesController.category,
  articlesController.show)

page('/author/:author', articlesController.author);
page.start();
