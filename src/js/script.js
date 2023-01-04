// Fetch the json payload
const response = await fetch("./src/js/mashup.json");
const json_data = await response.json();
// Set some application constants.
const APP_DEBUG = true
const MAX_GUESSES = -1;
const html_image = document.getElementById("html_image");
const debug_div = document.getElementById("debug_div");
const debug_span = document.getElementById("debug_span");
const guess_btn = document.getElementById("guess_btn");
const newgame_btn = document.getElementById("newgame_btn");
const keyword1 = document.getElementById("keyword1");
const keyword2 = document.getElementById("keyword2");
const guess_feedback = document.getElementById("guess_feedback");
var guesses = 0;
var gameover = false;
var keyword1_right = false;
var keyword2_right = false;

// Pick a random item from this json
var item_id = get_item(json_data);
render_items();

guess_btn.onclick = function(){
    if ((keyword1.value.length === 0 || keyword2.value.length === 0))
    {console.log('⚠️ Empty guess.');
    show_message('Cant Guess Nothing!','You left one of your guesses blank. Try filling out both guesses.')
    return -1;}

    if ((keyword1.value == keyword2.value) || (keyword2.value == keyword1.value))
    {console.log('⚠️ You cant guess the same thing twice!');
    show_message('Two of the same?','You guessed the same thing twice, guess something different.')
    return -1;}

    console.log('Your guess is ' + keyword1.value + ' & ' + keyword2.value)
    // Check if they got both right in one go
    if ((keyword1.value == json_data.mashup[item_id].keyword1) && (keyword2.value == json_data.mashup[item_id].keyword2))
    {
        console.log('✅ Correct guess! You got both words right!')
        show_message('Great job!','You figured out the AI mashup!')
        keyword_success(keyword1);
        keyword_success(keyword2);
        keyword1_right = true;
        keyword2_right = true;
    } else if ((keyword1.value == json_data.mashup[item_id].keyword2) && (keyword2.value == json_data.mashup[item_id].keyword1)) {
        show_message('Great job!','You figured out the AI mashup!')
        console.log('✅ Correct guess! You got both words right! (They were flipped)')
    }
    else if (((keyword1.value == json_data.mashup[item_id].keyword1) || (keyword1.value == json_data.mashup[item_id].keyword2)) && keyword1_right == false) {
        console.log('✅ You got word 1 right')
        show_message('Thats one...','You figured out one of the two mashup keywords. Keep trying!')
        keyword_success(keyword1);
        keyword1_right = true;
    }
    else if (((keyword2.value == json_data.mashup[item_id].keyword1) || (keyword2.value == json_data.mashup[item_id].keyword2)) && keyword2_right == false) {
        console.log('✅ You got word 2 right')
        show_message('Thats one...','You figured out one of the two mashup keywords. Keep trying!')
        keyword_success(keyword2);
        keyword2_right = true;
    } else {
        guesses++
        var remaining_gusses = MAX_GUESSES-guesses
        if (MAX_GUESSES == -1)
        {console.log('❌ Wrong guess, Try again!')
        show_message('Not Quite...','Give it another go.')}
        else {
            if (gameover)
            {console.log('❌ Wrong guess! Game Over!')}
            else
            {console.log('❌ Wrong guess! Guesses remaining: ' + remaining_gusses)}
        }
    }
};

function show_message(header, msg) 
{
    guess_feedback.style.display = 'block';
    guess_feedback.innerHTML = '<strong>' + header + '</strong> ' + msg;
}

function keyword_success(id)
{
    id.style.backgroundColor = 'green';
    id.style.color = 'white';
    id.disabled = true;
}

function keyword_reset(id)
{
    id.style.backgroundColor = '';
    id.style.color = '';
    id.disabled = false;
    id.value = '';
}

function get_item(json_data)
{
    var guesses = 0;
    let item = Math.floor(Math.random() * json_data.mashup.length);
    if (APP_DEBUG == true)
    {
        // DEBUG: Return the object that was randomly picked to the console
        console.log('🎲 [DEBUG IS ENABLED] Your mashup is: \x1B[93;4m' + json_data.mashup[item].keyword1 + '\x1B[m & \x1B[93;4m' + json_data.mashup[item].keyword2 + '\x1B[m. Complete object below.')
        console.log(json_data.mashup[item]);
        // debug_div.style.display = 'block';
    }
    return item
}

newgame_btn.onclick = function() {
    {
        keyword_reset(keyword1);
        keyword_reset(keyword2);
        keyword1_right = false;
        keyword2_right = false;
        guess_feedback.style.display = 'none';
        item_id = get_item(json_data);
        render_items();
    }
};

function render_items() 
{
    html_image.src = 'img/' + json_data.mashup[item_id].image
    debug_span.innerHTML = '<u>' + json_data.mashup[item_id].keyword1 + '</u> & <u>' + json_data.mashup[item_id].keyword2 + '</u>. Using image: <u>' + json_data.mashup[item_id].image + '</u>.'
}