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
    for(var i=0;i<word_array.length - 2;i++){

        var word_window = [];

        //Store this and the next word (after cleaning them)
        word_window[0] = removePunctuation(word_array[i]);
        word_window[1] = removePunctuation(word_array[i+1]);
        word_window[2] = removePunctuation(word_array[i+2]);

        if(word_window[0] !== "" && word_window[1] !== "" && word_window[2] !== ""){

            if(!Array.isArray(word_lookup[word_window[0]])){
                word_lookup[word_window[0]] = new Array();
            }

            if(!Array.isArray(word_lookup[word_window[0]][word_window[1]])){
                word_lookup[word_window[0]][word_window[1]] = new Array();
            }

            if(Array.isArray(word_lookup[word_window[0]]) && Array.isArray(word_lookup[word_window[0]][word_window[1]])){            
                word_lookup[word_window[0]][word_window[1]].push(word_window[2]);
            }            

        }    

    }

}

function generateText(){

    //Ingest params & get a random second word
    var startingWord = $('#startingWord').val();
    var  possibleFollowingWords = Object.keys(word_lookup[startingWord]);
    var randomSecondWord = possibleFollowingWords[Math.floor(Math.random()*possibleFollowingWords.length)];
    generation_length = $('#generationLength').val();

    //Check the word is available
    var word_available = getNextWord(startingWord, randomSecondWord) !== undefined;

    if(word_available){

        //Variable setup
        var sentence = startingWord + " " + randomSecondWord;
        var prevWords = [startingWord, randomSecondWord];


        //Update the UI output
        $('#output').text(sentence);

        //Loop through and construct the sentence        
        for(i=0;i<generation_length;i++){
            ''
            //Get the possible next words
            availableWordSelection = getNextWord(prevWords[0], prevWords[1]);

            console.log("Next word selection:");
            if(availableWordSelection == undefined){ //We couldnt find a following word
                availableWordSelection = getNextRandom(prevWords[1]);
                if(availableWordSelection == undefined){//We still couldn't find a next word
                    availableWordSelection = getTotalRandom(prevWords[0], prevWords[1]);
                }
            }
            console.log(availableWordSelection);


            //Choose one
            var thisWord = availableWordSelection[Math.floor(Math.random()*availableWordSelection.length)];

            //Add to the sentence
            sentence += " " + thisWord;
            //Update the UI output
            $('#output').text(sentence);

            //Update the list of previous words to be the last and the new word            
            prevWords = [prevWords[1], thisWord];

        }

    }else{
        alert("This word is not available in the training data.");
    }   

}

function getNextWord(word1, word2){
    return word_lookup[word1][word2];
}

function getNextRandom(word1){    
    var possibleWord2 = Object.keys(word_lookup[word1]);
    var word2 = possibleWord2[Math.floor(Math.random()*possibleWord2.length)];
    return word_lookup[word1][word2];
}

function getTotalRandom(oldWord1, oldWord2){    

    var possibleWord1 = null;
    var word1 = null;
    var possibleWord2 = null;
    var word2 = null;

    while(notMatched){
        possibleWord1 = Object.keys(word_lookup);
        word1 = possibleWord1[Math.floor(Math.random()*possibleWord1.length)];
        possibleWord2 = Object.keys(word_lookup[word1]);
        word2 = possibleWord2[Math.floor(Math.random()*possibleWord2.length)];
        notMatched = (word1 == oldWord1 || word1 == oldWord2) || (word2 == oldWord1 || word2 == oldWord2);
    }

    possibleOutput = word_lookup[word1][word2];
    return possibleOutput[Math.floor(Math.random()*possibleOutput.length)];
}

function removePunctuation(text) {
    var skip = true;

    if(!skip){
        var newText = text.replace(/[\[\].,’"\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
        var newnewText = newText.replace(/[0-9]/g,"");
        return newnewText.replace(" ","").toLowerCase();
    }else{
        return text;
    }
}