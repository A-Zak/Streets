var TEMPLATES_DIR = '/public/templates/';

angular.module('streets', [
    'ngRoute'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'HomeController',
      templateUrl: TEMPLATES_DIR + 'home.html'
    })
    .otherwise({
      redirectTo:'/'
    });
});