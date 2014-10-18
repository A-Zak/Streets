var TEMPLATES_DIR = '/public/templates/';

angular.module('streets', [
    'ngRoute', 'restangular'
])

.constant('HOMEPAGE_STORY_ID', '54421f0feb3085e9c4886f62')
.service('StoryCursorService', function() {
    var storyCursor = 0;

    this.next = function() {
        storyCursor += 1;
        return storyCursor;
    };

    this.prev = function() {
        storyCursor -= 1;
        return storyCursor;
    };

    this.curr = function() {
        return storyCursor;
    };

    this.peekNext = function() {
        return storyCursor + 1;
    }

    this.peekPrev = function() {
        return storyCursor - 1;
    }
})
.service('StoryService', function(Restangular, $q) {
    var storyCache = {};

    // getFirstStory returns a promise
    this.getFirstStory = function() {
        return Restangular.one('firstStory').get();
    };

    // getOneStory returns a promise
    this.getOneStory = function(storyId) {
        if (storyId in storyCache) {
            var deferred = $q.defer();
            deferred.resolve(storyCache[storyId]); // Immediately resolve with the cached version

            return deferred.promise;
        } else {
            var p = Restangular.one('story',storyId).get();

            p.then(function(story) {
                storyCache[story._id] = story;
            }); // Cache it when it returns;

            return p;
        }
    };

    // getRandomStory returns a promise
    this.getRandomStory = function() {
        var p = Restangular.one('story').get();

        p.then(function(story) {
            storyCache[story._id] = story;
        }); // Cache it when it returns;

        return p;
    };

    var storyOrder = {};

    // getNextStory returns a promise
    this.getStoryByOrderIndex = function(storyIndex) {

        if ( typeof(storyOrder[storyIndex]) !== 'undefined') {
            return this.getOneStory(storyOrder[storyIndex]);
        } else {
            var p = this.getRandomStory();

            p.then(function(newStory) {
                storyOrder[storyIndex] = newStory._id;
            });

            return p;
        }
    };
})
.config(function($routeProvider, RestangularProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      controller:'StoryPageController',
      templateUrl: TEMPLATES_DIR + 'story_page.html',
      resolve: {
          'story': function(StoryService) { return StoryService.getFirstStory(); }
      }
    })
    .when('/story/:storyId', {
      controller:'StoryPageController',
      templateUrl: TEMPLATES_DIR + 'story_page.html',
      resolve: {
          'story': function($route, StoryService) { return StoryService.getOneStory($route.current.params.storyId); }
      }
    })
    .when('/add_story', {
        controller:'AddStoryController',
        templateUrl: TEMPLATES_DIR + 'add_story.html',

    })
    .when('/about', {
        templateUrl: TEMPLATES_DIR + 'about.html',

    })
    .otherwise({
      redirectTo:'/'
    });

  RestangularProvider.setBaseUrl('/api');
});
//.directive('')