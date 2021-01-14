'use strict';

module.exports = app => {
  app.router.post('/user/register', app.controller.user.register);
};
