angular.module('streets')
.service('RandomCallToActionService', function(CALL_TO_ACTION_TEXTS) {
    this.getCallToAction = function() {
        var r = Math.random();
        var numTexts = CALL_TO_ACTION_TEXTS.length;

        var index = Math.floor(r * numTexts);

        return CALL_TO_ACTION_TEXTS[index];
    }
})
.constant('CALL_TO_ACTION_TEXTS', [
    'What\'s your craziest night in TLV?',
    'What was your strangest date in TLV?',
    'Your favorite beach in TLV',
    'Who\'s the strangest person you\'ve met?',
    'Your tel-avivian love',
    'The craziest thing that happened to you in TLV',
    'The time you walked your dog and...',
    'When it started raining and...',
    'The time the power went off and..',
    'The best place in TLV for...',
    'Your favourite place in TLV?',
    'That thing you did when you thought no one was looking',
    'That time you discovered your secret place in TLV',
    'When you were SO embarrassed',
    'That night you\'d like to forget...',
    'That walk of shame',
    'The moment you\'ll never forget',
    'That time you spoke with a stranger',
    'The time I realized I was a hipster',
    'The place I met my boyfriend',
    'That time I lost my wallet',
    'That time I lost my phone',
    'That time a stranger helped me',
    'That time I danced all night',
    'I couldn\'t believe it when my bicycle was stolen again',
    'That uneccessary drink',
    'You were gone for 5 minutes and..',
    'The time when I....',
    'The thing that always happens to you',
    'You and the social protest of the summer',
    'The time you tried to pick up surfing...',
    'The time you had a flat tyre...',
    'The time you lost your keys... ',
    'Your first cigarette in TLV',
    'The time you spilled coffee on a client',
    'The time you fell asleep on a bench',
    'The time you met your Idol in the Roxen',
    'You gave your number in TEDER',
    'The time you had a fight with the bouncer',
    'Your favorite book shop',
    'Your late night swim',
    'The best garden in TLV',
    'Your favorite Hummus place',
    'Your first kiss in TLV',
    'A family story that happened in....',
    'Your childhood in TLV',
    'Your first apartment in TLV',
    'That time you did the Night Run...',
    'I saw a celeb in TLV'
]);