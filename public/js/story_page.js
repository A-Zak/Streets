angular.module('streets')
.controller('StoryPageController', function($interval, $timeout, $scope, story, StoryService, $location, StoryCursorService, RandomCallToActionService, SocialShareService) {
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

    // Replace call to action every 5s
    $scope.call_to_action = RandomCallToActionService.getCallToAction();

    $interval(function() {
        $('#story-yours').animate({opacity: 0},{
            duration: 400,
            complete: function() {
                $scope.call_to_action = RandomCallToActionService.getCallToAction();

                $timeout(function() {
                    $('#story-yours').animate({opacity: 1}, 400);
                })
            }
        })

    },4000);

    $scope.launchTwitterShare = function() {
        SocialShareService.twitterShareUrl($location.absUrl());
    }

    $scope.launchFacebookShare = function() {
        SocialShareService.facebookShareUrl($location.absUrl());
    }
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
})
.service('SocialShareService', function($window) {
    this.twitterShareUrl = function(urlToShare) {
        var TEXT_FOR_TWEET = 'Look at this awesome story I read on StreetsTLV';

        var width = 575,
            height = 400,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;

        var url = 'https://twitter.com/intent/tweet?url='+encodeURIComponent(urlToShare)+'&text='+encodeURIComponent(TEXT_FOR_TWEET);
        $window.open(url, '_blank', opts);
    };

    this.facebookShareUrl = function(urlToShare) {
        var FACEBOOK_APP_ID = '543308622468738';

        var width = 575,
            height = 400,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;

        var url = 'https://www.facebook.com/dialog/share?app_id='+FACEBOOK_APP_ID+'&href='+encodeURIComponent(urlToShare)+'&display=popup&redirect_uri='+encodeURIComponent(urlToShare);
        $window.open(url, '_blank', opts);
    }
});