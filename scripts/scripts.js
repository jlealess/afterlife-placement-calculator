$(function() {
    // global variables
    const $scoreboard = $("#scoreboard");
    let score = 0;

    // hide child questions on load
    // $(".child").hide();
    // $(".parent button").hide();


    // event handler for forms with radio input
    $('.form__radio').on('change', function(e) {
        e.preventDefault();

        const $answer = $(this).find('input:checked');
        const answerValue = $answer.val();   

        if(answerValue.length > 0) {
            const answerPointValue = Number($answer.data("pointvalue"));
            updateScore(answerPointValue)
            
            if($answer.data("showchild")) {
                $("form").next().show();
            } else {
                $(this).find('button').show();
            }
        }
    });

    // $('button').on("click", function(e) {
    //     e.preventDefault();
    //     //console.log("clickity click!");
    //     $(this).next("form:not[.child]").show();
    // })

    const updateScore = function(delta) {
        score += delta;
        $scoreboard.removeClass("good bad");

        if(score > 0) {
            $scoreboard.addClass("good");
        } else if (score < 0) {
            $scoreboard.addClass("bad");
        } 
        $scoreboard.text(score.toFixed(2));

    }

    
})