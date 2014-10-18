angular.module('streets')
.controller('StoryPageController', function($scope, story, StoryService, $location) {
    $scope.story = story;

    $scope.toPreviousStory = function() {
        StoryService.getRelatedStory(story._id,'previous').then(function(story) {
            $location.path('/story/'+story._id);
        });
    };

    $scope.toNextStory = function() {
        StoryService.getRelatedStory(story._id,'next').then(function(story) {
            $location.path('/story/'+story._id);
        });
    };
});