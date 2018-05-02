$(function() {
    // global variables
    const $scoreboard = $("#scoreboard");
    let score = 0;

    // add storedpoints data element to all forms
    $("form").data("storedpoints", "");

    // hide child questions on load
    $(".form__child").hide();

    // event handler for forms with radio input
    $('.form__radio input').on('change', function(e) {
        e.preventDefault();

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
                childForm.show();
            } else if(childStatus === false) {
                childForm[0].reset();
                let childStoredPoints = childForm.data("storedpoints");                
                if (childStoredPoints !== "") {
                    let childStoredPointsNum = Number(childStoredPoints);
                    updateScore(childStoredPointsNum * -1);
                    childForm.data("storedpoints", "");
                }

                childForm.hide();
            }
        }


    });

    $('.form__checkbox input').on('change', function() {
            const answerPointValue = $(this).data("pointvalue");
            const isChecked = $(this).is(':checked');

            if (isChecked) {
                updateScore(answerPointValue);
            } else if (!isChecked) {
                updateScore(-answerPointValue);
            }
    });

    $("#endQuiz").on("click", function() {
        tabulateVerdict();
    });

    // $('button').on("click", function(e) {
    //     e.preventDefault();
    //     //console.log("clickity click!");
    //     $(this).next("form:not[.child]").show();
    // })

    const updateScore = function(delta) {
        updateVerdict("");
        score += Number(delta);
        (score === 0 ? $scoreboard.text(score) : $scoreboard.text(score.toFixed(2)));
        
        $scoreboard.removeClass("good bad");
        if(score > 0) {
            $scoreboard.addClass("good");
        } else if (score < 0) {
            $scoreboard.addClass("bad");
        } 
    }

    const updateVerdict = function(update) {
        const $resultDisplay = $("#finalResults");
        $resultDisplay.text(update);
    }

    const tabulateVerdict = function() {
        let verdict;

        if(score > 100) {
             verdict = `You did it! You're more perfect than perfect. (Any place or thing in the universe can be up to 104% perfect. That's how you get Beyoncé.) Welcome to the Good Place. You know the way you feel when you see a picture of two otters holding hands? That's how you're gonna feel every day.`;
        } else if(score < -100) {
            verdict = `Well, you forked up. You're a mess, morally speaking. You're a putrid, disgusting bowl of ethical soup. All aboard the 3:18 train to the Bad Place, making thousands of stops for literally no reason. The dining car is at the very back of the train. It serves only room-temperature Manhattan clam chowder, and also, it's closed.`;
        } else {
            verdict = `Look. you might not have been a saint, but it's not like you killed anybody. You weren't an arsonist. You never found a wallet outside of an IHOP and thought about returning it but saw the owner lived out of state so just took the cash and dropped the wallet back on the ground. You're a medium person. You get to spend eternity in a medium place. Like Cincinatti.`;
        }

        updateVerdict(verdict);
        
    }

    
})