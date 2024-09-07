//This script takes a given user text & trains itself on it to then allow the user to be able to generate sentences based on the text.

var word_lookup = {};
var generation_length = 5;

function ingestText(){    
    
    word_lookup = {};

    //UI
    $('#inputButton').attr('diabled', true);

    //First split our training text by spaces (to get just words)
    inputText = $('#inputText').val();
    inputText = inputText.replace(/[\n\r]/g, " ");
    word_array = inputText.split(" ");

    //Take that word array and find common following words for each word
    for(var i=0;i<word_array.length - 1;i++){

        var word_window = [];

        //Store this and the next word (after cleaning them)
        word_window[0] = removePunctuation(word_array[i]).toLowerCase();
        word_window[1] = removePunctuation(word_array[i+1]).toLowerCase();

        if(word_window[1] != ""){
            if(word_lookup[word_window[0]] !== undefined){
                word_lookup[word_window[0]].push(word_window[1])
            }else{
                word_lookup[word_window[0]] = [word_window[1]];
            }
        }
    }    

    console.log(word_lookup);

}

function generateText(){

    //Ingest params
    var startingWord = $('#startingWord').val();
    generation_length = $('#generationLength').val();

    //Check the word is available
    if(word_lookup[startingWord] == undefined){
        alert("This word is NOT in the training data.")
    }else{
        //Generate the sentence
        var sentence = startingWord;
        var prevWord = startingWord;
        $('#output').text(sentence);
        for(i=0;i<generation_length;i++){

            //Get the possible next words
            availableWordSelection = getNextWord(prevWord);

            //Choose one
            var thisWord = availableWordSelection[Math.floor(Math.random()*availableWordSelection.length)];

            sentence += " " + thisWord;
            $('#output').text(sentence);
            prevWord = thisWord;
        }
    }

    

}

function getNextWord(text){
    return word_lookup[text];
}

function removePunctuation(text) {
    var newText = text.replace(/[\[\].,"\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
    var newnewText = newText.replace(/[0-9]/g,"");
    return newnewText.replace(" ","");
}