const pathToImages = "images/"
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
    const $resultMessage = $("#resultMessage");
    const $resultImage = $("#resultImage");
    const $resultHeadline = $("#resultHeadline");


    const headline = results[status].headline;
    const img = results[status].images[0];
    const verdict = results[status].message;

    $resultMessage.html(`<p class="paragraph paragraph__center">${verdict}</p>`);
    $resultImage.html(`<img src="${pathToImages}${img}" />`);
    $resultHeadline.html(`<h2>${headline}</h2>`);
}


$(function() {
    // global variables
    const $scoreboard = $("#scoreboard .wrapper");
    const $scoreDisplay = $("#currentScore");
    let score = 0;

    // add storedpoints data element to all forms
    $("form").data("storedpoints", "");

    // hide elements on load
    $("main").hide();
    $("#endQuiz").hide();
    $(".form").hide();
    $("#intro").hide();
    $(".next").hide();
    $("#scoreboard").hide();
    $("#play").hide();
    //$(".form__child .next").show();


   // event handler for forms with radio input
    $('input[type=radio]').on('change', function() {

        const $answer = $(this);
        const answerValue = $answer.val();  
        const answerPointValue = $answer.data("pointvalue");
        const parentForm = $answer.closest("form");

        let storedPoints = parentForm.data("storedpoints");
        if(storedPoints !== "") {
            let storedPointsNum = Number(storedPoints);
            updateScore(storedPointsNum * -1);            
        }
        parentForm.data("storedpoints", answerPointValue);
        updateScore(answerPointValue);

        if (parentForm.hasClass("form__parent")) {
            const childForm = $(this).closest("form").next(".form__child");
            const childStatus = $(this).data("showchild");

            if(childStatus === true) {
                // case: child question is relevant
                childForm.show();
            } else if(childStatus === false) {
                // case: child question is not relevant
                childForm[0].reset();
                let childStoredPoints = childForm.data("storedpoints");                
                if (childStoredPoints !== "") {
                    let childStoredPointsNum = Number(childStoredPoints);
                    updateScore(childStoredPointsNum * -1);
                    childForm.data("storedpoints", ""); 
                    parentForm.find(".next").hide();  
                }
                childForm.hide();
                parentForm.find(".next").fadeIn();
            }
        } else {
            parentForm.find(".next").fadeIn();
        }
    });

    // event handler for checkboxes
    $('input[type=checkbox]').on('change', function() {
        $(this).next('svg').toggleClass('fa-circle fa-check-circle');

            const answerPointValue = $(this).data("pointvalue");
            const isChecked = $(this).is(':checked');
            $(this).closest("form").find(".next").fadeIn();

            if (isChecked) {
                updateScore(answerPointValue);
            } else if (!isChecked) {
                updateScore(-answerPointValue);
            }
    });



    $("#endQuiz").on("click", function() {
        $("form").hide();
        $(this).hide();
        tabulateVerdict();
    });

    $('.next').on("click", function(e) {
        e.preventDefault();
        //console.log("clickity click!");
        $("form").hide();
        let nextForm = $(this).parents().next("form");
        if (nextForm.hasClass("form__child")) {
            nextForm = nextForm.next("form");
        }
        nextForm.fadeIn();
        //$(this).closest("form").show();
    })

    $('#start').on('click', function () {
        $('.welcome').hide();
        $('main').show();
        $('#intro').fadeIn();
        $('#play').fadeIn();
    })
    
    $('#play').on('click', function() {
        $('#intro').hide();
        $('#scoreboard').fadeIn();
        $('form:first-of-type').fadeIn();
    })

    const clearVerdict = function() {
        $(".result").empty();
    }

    const updateScore = function(delta) {
        clearVerdict();
        score += Number(delta);
        (score === 0 ? $scoreDisplay.text(score) : $scoreDisplay.text(score.toFixed(2)));
        
        $scoreDisplay.removeClass("good bad");
        if(score > 0) {
            $scoreDisplay.addClass("good");
        } else if (score < 0) {
            $scoreDisplay.addClass("bad");
        } 
    }

    const tabulateVerdict = function() {
        let status;

        if(score > 100) {
            status = "good";
        } else if(score < -100) {
            status = "bad";
        } else {
            status = "medium";
        }
        updateVerdict(status);
    }
  
})