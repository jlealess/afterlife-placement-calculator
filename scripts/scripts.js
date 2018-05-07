// global variables
const $scoreDisplay = $('#currentScore');
let score = 0;
const pathToImages = 'images/';
const pathToQuiz = 'http://jackielealess.com/afterlife-placement-calculator';
const results = {
    bad: {
        headline: "The Bad Place",
        images: [
            'ah-shirt.gif'
        ],
        message: "Well, you forked up. You're a mess, morally speaking. You’re a putrid, disgusting bowl of ethical soup. All aboard the 3:18 train to the Bad Place, making thousands of stops for literally no reason. The dining car is at the very back of the train. It serves only room-temperature Manhattan clam chowder, and also, it’s closed."
    },
    good: {
        headline: "The Good Place",
        images: [
            'shirtballs.gif'
        ],
        message: "You did it! You’re more perfect than perfect. (Any place or thing in the universe can be up to 104% perfect. That's how you get Beyoncé.) Welcome to the Good Place. You know the way you feel when you see a picture of two otters holding hands? That's how you’re gonna feel every day."
    },
    medium: {
        headline: "The Medium Place",
        images: [
            'medium-place.gif'
        ],
        message: "Look. you might not have been a saint, but it's not like you killed anybody. You weren’t an arsonist. You never found a wallet outside of an IHOP and thought about returning it but saw the owner lived out of state so just took the cash and dropped the wallet back on the ground. You’re a medium person. You get to spend eternity in a medium place. Like Cincinnati."
    }
    
}

const updateVerdict = function (status) {
    const $resultMessage = $('#resultMessage');
    const $resultImage = $('#resultImage');
    const $resultHeadline = $('#resultHeadline');

    const headline = results[status].headline;
    const img = results[status].images[0];
    const verdict = results[status].message;

    $resultMessage.html(`<p class="paragraph paragraph__center">${verdict}</p>`);
    $resultImage.html(`<img src="${pathToImages}${img}" />`);
    $resultHeadline.html(`<h2 class="heading"><span class="heading__subhead">Your destination: </span>${headline}</h2>`);
    $('.results').fadeIn();
    $('footer').fadeIn();
    $('main').toggleClass('has-background');

    populateTweeter(status);

}

const populateTweeter = function (status) {
    status = status.charAt(0).toUpperCase() + status.substr(1);
    $('#tweeter a').attr('href', `https://twitter.com/intent/tweet?text=Holy shirtballs! I'm headed for the ${status} Place via the Afterlife Placement Calculator. Check your destination at ${pathToQuiz}`);
}

const clearVerdict = function () {
    $('.result').empty();
}

const updateScore = function (delta) {
    clearVerdict();
    score += Number(delta);
    (score === 0 ? $scoreDisplay.text(score) : $scoreDisplay.text(score.toFixed(2)));

    $scoreDisplay.removeClass('good bad');
    if (score > 0) {
        $scoreDisplay.addClass('good');
    } else if (score < 0) {
        $scoreDisplay.addClass('bad');
    }
}

const tabulateVerdict = function () {
    let status;

    if (score > 100) {
        status = 'good';
    } else if (score < -100) {
        status = 'bad';
    } else {
        status = 'medium';
    }
    updateVerdict(status);
}

$(function() {

    // add storedpoints data element to all forms
    $('.form').data('storedpoints', "");

    // hide elements on load
    $('main').hide();
    $('.end-quiz').hide();
    $('.form').hide();
    $('#intro').hide();
    $('.next').hide();
    $('#scoreboard').hide();
    $('#play').hide();
    $('.results').hide();

   // event handler for forms with radio input
    $('input[type=radio]').on('change', function() {

        const $answer = $(this);
        const answerValue = $answer.val();  
        const answerPointValue = $answer.data('pointvalue');
        const parentForm = $answer.closest('form');

        let storedPoints = parentForm.data('storedpoints');
        if(storedPoints !== "") {
            let storedPointsNum = Number(storedPoints);
            updateScore(storedPointsNum * -1);            
        }
        parentForm.data('storedpoints', answerPointValue);
        updateScore(answerPointValue);

        if (parentForm.hasClass('form__parent')) {
            const childForm = $(this).closest('form').next('.form__child');
            const childStatus = $(this).data('showchild');

            if(childStatus === true) {
                // case: child question is relevant
                childForm.show();
                parentForm.find('.next').hide();  
            } else if(childStatus === false) {
                // case: child question is not relevant
                childForm[0].reset();
                let childStoredPoints = childForm.data('storedpoints');                
                if (childStoredPoints !== "") {
                    let childStoredPointsNum = Number(childStoredPoints);
                    updateScore(childStoredPointsNum * -1);
                    childForm.data('storedpoints', ""); 
                    parentForm.find('.button').hide();  
                }
                childForm.hide();
                parentForm.find('.button').addClass('animated fadeInUp').fadeIn();
            }
        } else {
            parentForm.find('.button').addClass('animated fadeInUp').fadeIn();
        }
    });

    // event handler for checkboxes
    $('input[type=checkbox]').on('change', function() {
        $(this).parent().toggleClass('selected');
        $(this).next('svg').toggleClass('fa-circle fa-check-circle');

            const answerPointValue = $(this).data("pointvalue");
            const isChecked = $(this).is(':checked');
            $(this).closest('form').find('.button').fadeIn();

            if (isChecked) {
                updateScore(answerPointValue);
            } else if (!isChecked) {
                updateScore(-answerPointValue);
            }
    });

    $('.end-quiz').on('click', function(e) {
        e.preventDefault();
        $('form').hide();
        $(this).hide();
        $('#currentScoreLabel').text('Final score');
        tabulateVerdict();
    });

    $('.next').on("click", function(e) {
        e.preventDefault();
        $('form').hide();
        let nextForm = $(this).parents().next('form');
        if (nextForm.hasClass('form__child')) {
            nextForm = nextForm.next('form');
        } 
        nextForm.fadeIn();
        if (nextForm.hasClass('form__checkbox')) {
            nextForm.find('.button').fadeIn();
        }    
    })

    $('#start').on('click', function () {
        $('.welcome').hide();
        $('main').show();
        $('#intro').fadeIn();
        $('#play').addClass('animated fadeInUp').fadeIn();
        $('footer').hide();
    })
    
    $('#play').on('click', function() {
        $('#intro').hide();
        $('#scoreboard').fadeIn();
        $('form:first-of-type').fadeIn();
        $('main').toggleClass('has-background');
    })

  
})