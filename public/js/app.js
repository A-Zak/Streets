var TEMPLATES_DIR = '/public/templates/';

function isRTL(s){
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};

angular.module('streets', [
    'ngRoute', 'restangular'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'HomeController',
      templateUrl: TEMPLATES_DIR + 'home.html'
    })
    .when('/story', {
      controller:'StoryPageController',
      templateUrl: TEMPLATES_DIR + 'story_page.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})
.directive('')