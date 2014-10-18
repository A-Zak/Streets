angular.module('streets')
.controller('StoryPageController', function($scope, story, StoryService, $location, StoryCursorService) {
    $scope.story = story;

    // Pre-fetch next and prev
    StoryService.getStoryByOrderIndex(StoryCursorService.peekNext());
    StoryService.getStoryByOrderIndex(StoryCursorService.peekPrev());

    // Actions for next and prev
    $scope.toPreviousStory = function() {
        StoryService.getStoryByOrderIndex(StoryCursorService.prev()).then(function(story) {
            $location.path('/story/'+story._id);
        });
    };

    $scope.toNextStory = function() {
        StoryService.getStoryByOrderIndex(StoryCursorService.next()).then(function(story) {
            $location.path('/story/'+story._id);
        });
    };
    $scope.first_word = function() {
        return story.split(' ')[0];
    };
})
.filter('stFirstWord', function() {
     return function(text) {
            return text.split(' ')[0];
     }
})
.filter('stAllButFirstWord', function() {
     return function(text) {
            return text.split(' ').slice(1).join(' ');
     }
});