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
.constant('HOMEPAGE_STORY_ID', '544245f6b17e642414e1ca00')
.service('StoryService', function(Restangular, $q) {
    var storyCache = {};

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
    }

    storyOrder = [];

    // getNextStory returns a promise
    this.getRelatedStory = function(currStoryId, direction) {
        // If we have a cached related story return it
        var storyIndex = storyOrder.indexOf(currStoryId);

        if (storyIndex === -1) {
            // If we get an unknown story, reset the story order and make a new one
            // (This is the fastest way to clear a list in javascript)
            while (storyOrder.length > 0) { storyOrder.pop(); }

            storyOrder.push(currStoryId);
            storyIndex = storyOrder.indexOf(currStoryId);
        }

        var nextStoryIndex;

        if ( direction === 'next') {
            nextStoryIndex = storyIndex + 1;
        } else if ( direction === 'prev') {
            nextStoryIndex = storyIndex - 1;
        } else {
            throw Error('Invalid position passed to getRelatedStory.');
        }

        if ( typeof(storyOrder[nextStoryIndex]) !== 'undefined') {
            return this.getOneStory(storyOrder[nextStoryIndex]);
        } else {
            var p = this.getRandomStory();

            p.then(function(newStory) {
                if (nextStoryIndex === -1) {
                    storyOrder.unshift(newStory._id);
                } else {
                    storyOrder.push(newStory._id);
                }
            });

            return p;
        }
    };
})
.config(function($routeProvider, RestangularProvider) {
  $routeProvider
    .when('/', {
      controller:'StoryPageController',
      templateUrl: TEMPLATES_DIR + 'story_page.html',
      resolve: {
          'story': function(HOMEPAGE_STORY_ID, StoryService) { return StoryService.getOneStory(HOMEPAGE_STORY_ID); }
      }
    })
    .when('/story/:storyId', {
      controller:'StoryPageController',
      templateUrl: TEMPLATES_DIR + 'story_page.html',
      resolve: {
          'story': function($route, StoryService) { return StoryService.getOneStory($route.current.params.storyId); }
      }
    })
    .otherwise({
      redirectTo:'/'
    });

  RestangularProvider.setBaseUrl('/');
});
//.directive('')