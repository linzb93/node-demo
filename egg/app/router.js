module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/user/:id', controller.home.user);
    router.get('/download', controller.home.download)

    // router.verb('path-match', 'report', controller.home.user);
  };