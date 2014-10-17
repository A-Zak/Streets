angular.module('streets')
.controller('StoryPageController', function($scope, $http) {
        $http.get('/story').success(function(story) {
            $scope.story = story;
        });
    })