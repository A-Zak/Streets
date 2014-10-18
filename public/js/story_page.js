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
});