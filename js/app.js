 /* Selects a given number of random words from the list.
 * @param {string[]} words - The array of words to select from.
 * @param {number} count - The number of words to select.
 * @returns {string[]} - An array of randomly selected words.
 */
function selectRandomWords(words, count) {
  const selectedWords = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWords.push(words[randomIndex][0]);
  }
  return selectedWords;
}

/**
 * Capitalizes a random word from the given word array.
 * @param {string[]} words - The array of words to choose from.
 * @returns {string} - A randomly selected word in uppercase.
 */
function getRnd(words) {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

/**
 * Injects the selected content into the DOM.
 * @param {string} h1Word - The word to display in the <h1> tag.
 * @param {string[]} allWords - The array of all selected words.
 */
function injectContent(h1Word, allWords) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = `
    <h1>${h1Word.toUpperCase()}</h1>
  `;

  // Create a container for the words and images
  const wordImageContainer = document.createElement('div');
  wordImageContainer.style.display = 'grid';
  wordImageContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
  wordImageContainer.style.gap = '10px';

  // Fetch images for all words and dynamically add them
  allWords.forEach(word => {
    // Create a container for each word
    const wordContainer = document.createElement('div');
    wordContainer.style.textAlign = 'center';


    // Create the image element
    const wordImage = document.createElement('img');
    wordImage.src = ''; // Placeholder image while loading
    wordImage.style.width = '150px';
    wordImage.style.height = '150px';
    wordImage.alt = word;

    wordImage.addEventListener('click', () => {
      if (word.toUpperCase() === h1Word.toUpperCase()) {
        onRightAction();
        console.log("ok " + word +"," +h1Word);
      } else {
        console.log("nok " + word +"," +h1Word);
        onWrongAction();
      }
      location.reload()
    });


    //wordImage.src='http://localhost:63342/muttaburrasaurus/icon.png'; // Fallback image
    // Fetch and set the image for the word

	displayImageForWord(translateWord(word), wordImage);
//    fetchImageForWord(translateWord(word)).then(imageUrl => {
//      wordImage.src = imageUrl;
//    });

    // Append text and image to the word container
    wordContainer.appendChild(wordImage);

    // Add the word container to the main container
    wordImageContainer.appendChild(wordContainer);
    contentDiv.appendChild(wordImageContainer);

  });
}

function displayImageForWord(word, wordImage) {
  const cachedImage = localStorage.getItem(word); // Get the cached base64 image

  if (cachedImage) {
    // If the image is cached, set it as the src of the image element
    wordImage.src = cachedImage;
  } else {
    // If not cached, fetch the image
    fetchImageForWord(word).then(imageUrl => {
      if (imageUrl) {
	fetch(imageUrl)
          .then(imageResponse => {
            if (!imageResponse.ok) {
              throw new Error(`Failed to fetch image blob: ${imageResponse.status}`);
            }
            return imageResponse.blob(); // Convert the response to a blob
          })
          .then(blob => {
            // Create a FileReader to convert the blob to base64
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result; // This is the base64 encoded image
                localStorage.setItem(word, base64data); // Cache the base64 image in localStorage
        	wordImage.src = base64data; // Set the fetched image as the src
              };
              reader.onerror = reject; // Handle errors
              reader.readAsDataURL(blob); // Convert blob to base64
            });
          });
      } else {
        console.error(`No image found for the word: ${translatedWord}`);
      }
    });
  }
}

function fetchImageForWord(word) {
  const apiKey = 'akrwTd7sL2ard_cZQSSHuZLCwqekrum9X_O6Sb5e9bQ'; // Replace with your Unsplash API key
  const url = `https://api.unsplash.com/search/photos?query=${word}&client_id=${apiKey}`;

  

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.small; // Returns the first image's URL
      }
      return '';
    })
    .catch(error => {
      console.error(`Error fetching image for ${word}:`, error);
    });
}

// Function to fetch file content synchronously
function fetchSync(filePath) {
  const request = new XMLHttpRequest();
  request.open("GET", filePath, false); // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    return request.responseText;
  } else {
    throw new Error(`Failed to fetch file: ${filePath} (Status: ${request.status})`);
  }
}

// Function to translate a list of words using public/words.txt and public/words-en.txt
function translateWord(word) {
  try {

    // Create a dictionary for translations
    const dictionary = {};
    wordList.forEach((curr, index) => {
      if (wordList[index][1]) {
        dictionary[wordList[index][0]] = wordList[index][1];
      }
    });

    // Translate the list of words
    let dictionaryElement = dictionary[word];
    console.log("translated " + word + " --> " + dictionaryElement);
    return dictionaryElement;
  } catch (error) {
    console.error("Error reading files or translating words:", error);
    return null;
  }
}


// Initialize the RÄTT and FEL counters and persist them
let rightCounter = localStorage.getItem('rightCounter')
  ? parseInt(localStorage.getItem('rightCounter'), 10)
  : 0;

let wrongCounter = localStorage.getItem('wrongCounter')
  ? parseInt(localStorage.getItem('wrongCounter'), 10)
  : 0;

// Save the counters in localStorage if not already saved
localStorage.setItem('rightCounter', rightCounter);
localStorage.setItem('wrongCounter', wrongCounter);

// Create the RÄTT counter display
const rightCounterDisplay = document.createElement('div');
rightCounterDisplay.id = 'right-counter-display';
rightCounterDisplay.style.position = 'fixed';
rightCounterDisplay.style.bottom = '50px'; // Adjust position
rightCounterDisplay.style.right = '10px';
rightCounterDisplay.style.padding = '10px';
rightCounterDisplay.style.backgroundColor = '#2ecc71'; // Green background for RÄTT
rightCounterDisplay.style.color = '#fff';
rightCounterDisplay.style.fontFamily = 'Arial, sans-serif';
rightCounterDisplay.style.fontSize = '18px';
rightCounterDisplay.style.borderRadius = '5px';
rightCounterDisplay.style.zIndex = '1000';
rightCounterDisplay.textContent = `RÄTT ✅: ${rightCounter}`;
document.body.appendChild(rightCounterDisplay);

// Create the FEL counter display
const wrongCounterDisplay = document.createElement('div');
wrongCounterDisplay.id = 'wrong-counter-display';
wrongCounterDisplay.style.position = 'fixed';
wrongCounterDisplay.style.bottom = '10px'; // Adjust position
wrongCounterDisplay.style.right = '10px';
wrongCounterDisplay.style.padding = '10px';
wrongCounterDisplay.style.backgroundColor = '#e74c3c'; // Red background for FEL
wrongCounterDisplay.style.color = '#fff';
wrongCounterDisplay.style.fontFamily = 'Arial, sans-serif';
wrongCounterDisplay.style.fontSize = '18px';
wrongCounterDisplay.style.borderRadius = '5px';
wrongCounterDisplay.style.zIndex = '1000';
wrongCounterDisplay.textContent = `FEL ❌: ${wrongCounter}`;
document.body.appendChild(wrongCounterDisplay);

// Simulate actions for updating RÄTT and FEL counters
const onRightAction = () => {
  rightCounter++; // Increment RÄTT counter
  localStorage.setItem('rightCounter', rightCounter); // Persist in localStorage
  rightCounterDisplay.textContent = `RÄTT ✅: ${rightCounter}`; // Update display
};

const onWrongAction = () => {
  wrongCounter++; // Increment FEL counter
  localStorage.setItem('wrongCounter', wrongCounter); // Persist in localStorage
  wrongCounterDisplay.textContent = `FEL ❌: ${wrongCounter}`; // Update display
};


// Create a "Clear Counters" button
const clearButton = document.createElement('button');
clearButton.textContent = 'Reset Counters';
clearButton.style.position = 'fixed';
clearButton.style.bottom = '90px';
clearButton.style.right = '10px';
clearButton.style.padding = '5px 10px';
clearButton.style.fontFamily = 'Arial, sans-serif';
clearButton.style.fontSize = '14px';
clearButton.style.border = 'none';
clearButton.style.borderRadius = '5px';
clearButton.style.cursor = 'pointer';
clearButton.style.zIndex = '1000';
document.body.appendChild(clearButton);

// Add click event listener to clear/reset counters
clearButton.addEventListener('click', () => {
  // Reset counters to 0
  rightCounter = 0;
  wrongCounter = 0;

  // Update localStorage
  localStorage.setItem('rightCounter', rightCounter);
  localStorage.setItem('wrongCounter', wrongCounter);

  // Update UI display
  rightCounterDisplay.textContent = `RÄTT ✅: ${rightCounter}`;
  wrongCounterDisplay.textContent = `FEL ❌: ${wrongCounter}`;

  console.log("Counters reset successfully!");
});


// Main application logic
const selectedWords = selectRandomWords(wordList, 4);
const h1Word = getRnd(selectedWords);
injectContent(h1Word, selectedWords);
