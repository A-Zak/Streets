function isRTL(s){
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};

angular.module('streets')
.controller('StoryPageController', function($interval, $timeout, $scope, story, StoryService, $location, StoryCursorService, RandomCallToActionService, SocialShareService) {
    $scope.story = story;

    if (typeof(story.imageUrl) === 'undefined' || story.imageUrl.length === 0 ) {
        story.imageUrl = '/public/default.jpg';
    }

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

    var anim = $interval(function() {
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

    $scope.$on('$destroy', function() { $interval.cancel(anim); });

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
        var TEXT_FOR_TWEET = 'Look at this awesome story I read on Streets.City';

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