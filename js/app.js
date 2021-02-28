// UI Variables
let canvas = document.querySelector('#visuArr');
let visuArr = canvas.getContext('2d');
let canvasContainer = document.querySelector('#canvas-container');
// App Variables
let rectCount = 30;
let gapPixels = 2;
let margin = 30;
let rectWidth = ((canvasContainer.clientWidth - ((rectCount - 1) * gapPixels)) - margin) / rectCount;
// Array that stores the procentages of the canvas height that the rectangles take up
let arr = [];
// Smallest rectangle is 5% of the canvas height
let minHeight = 5;
// Biggest rectangle is 85% of the canvas height
let maxHeight = 85;
let stopBtnClicked = false;
let speed = 100;




// Start app on dom content load
document.addEventListener('DOMContentLoaded', function() {
    resizeCanvas();
    populateArray();
    shuffleArray();
});

// Array manipulation buttons event listeners
document.querySelector('#shuffle').addEventListener('click', shuffleArray);
document.querySelector('#increase').addEventListener('click', increaseArray);
document.querySelector('#decrease').addEventListener('click', decreaseArray);

// Array buttons for algorithms event listener
document.querySelector('#stop').addEventListener('click', () => stopBtnClicked = true);
document.querySelector('#speedIncrease').addEventListener('click', () => { if (speed > 5) speed /= 1.1; });
document.querySelector('#speedDecrease').addEventListener('click', () => { if (speed < 450) speed *= 1.1; });

// Resize array and canvas when window gets smaller or bigger
window.addEventListener('resize', () => {
    resizeCanvas();
    drawArray();
});

// Array sorting buttons event listeners
document.querySelector('#quickSort').addEventListener('click', quickSort);
document.querySelector('#mergeSort').addEventListener('click', mergeSort);
document.querySelector('#bubbleSort').addEventListener('click', bubbleSort);
document.querySelector('#insertionSort').addEventListener('click', insertionSort);
document.querySelector('#selectionSort').addEventListener('click', selectionSort);




// Function to fit canvas to whole screen, not just small area
function resizeCanvas() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight - 4;
}

// Function to populate the array with the right height values, according to screen height
function populateArray() {
    arr = [];
    let currHeight = minHeight;
    let increaseInHeight = (maxHeight - minHeight) / rectCount;
    for (let i = 0; i < rectCount; i++) {
        arr.push(currHeight + increaseInHeight);
        currHeight += increaseInHeight;
    }

    // Draw Array
    drawArray();
}

// Function to draw rectangles on canvas with height specified in array
function drawArray() {
    visuArr.clearRect(0, 0, canvas.width, canvas.height);

    rectWidth = ((canvasContainer.clientWidth - ((rectCount - 1) * gapPixels)) - margin) / rectCount;

    let currX = margin / 2;
    for (let i = 0; i < rectCount; i++) {
        // Array stores procentage of canvas height that rect takes up, this calculates actual height
        let heightOfRect = canvas.height * arr[i] / 100;
        visuArr.fillStyle = 'black';
        visuArr.fillRect(currX, canvas.height - heightOfRect, rectWidth, heightOfRect);
        currX = currX + rectWidth + gapPixels;
    }
}

// Function to randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray() {
    // Shuffle Array
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Redraw array
    drawArray();
}

// Function to increase the array size and redraw
function increaseArray() {
    // If array too big, cancel increase
    if (rectCount >= 75) return -1;

    rectCount++;
    
    // Set height value to new rectangle and add it to array
    arr.push(Math.random() * (maxHeight - minHeight) + minHeight);

    drawArray();
}

// Function to decrease the array size and redraw
function decreaseArray() {
    // If array too small, cancel decrease
    if (rectCount <= 10) return -1;

    rectCount--;

    // If removed element was the biggest, resize all the other ones
    let biggest = Math.max(...arr);
    if (arr.pop() == biggest) {
        let difference = biggest - Math.max(...arr);
        let newArr = arr.map(element => {
            return element + (element / 100 * (difference + .2));
        });
        arr = newArr;
    }
    drawArray();
}

// Function that visualizes Quick Sort
async function quickSort() {
    stopBtnClicked = false;
    changeArrayBtns(false);
   
    // Start alg with whole array
    await nextStepInAlg(0, arr.length - 1);

    drawArray();
    changeArrayBtns(true);

    async function nextStepInAlg(start, end) {
        if (stopBtnClicked) {
            drawArray();
            changeArrayBtns(true);
            return;
        }
        // If the array is 1 or less long, no need to solve it and call left and right
        if (start >= end) return;

        // Get index of pivot after array alteration
        let indexOfPivot = await partition(start, end);

        drawArray();
        // Quick sort the left side of the array
        await nextStepInAlg(start, indexOfPivot - 1);
        // Quick sort the right side of the array
        await nextStepInAlg(indexOfPivot + 1, end);
    }

    // Function that puts all elements bigger than pivot to the right, all smaller ones to the left
    // Returns the index of the pivot after alteration of array
    async function partition(start, end) {
        let pivotIndex = start;
        let pivotValue = arr[end];
        for (let i = start; i < end; i++) {
            highlightRect(pivotIndex, 'yellow');
            highlightRect(end, 'red');
            highlightRect(i, 'orange');

            if (stopBtnClicked) {
                drawArray();
                changeArrayBtns(true);
                return;
            }

            if (arr[i] < pivotValue) {
                swap(i, pivotIndex);
                pivotIndex++;
            }
            await sleep(speed);
            drawArray();
        }
        swap(pivotIndex, end);
        return pivotIndex;
    }
    
    // Swaps 2 elements of array
    function swap(a, b) {
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    
    // Syncronous function to sleep without stopping browser
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Function that visualizes Merge Sort
async function mergeSort() {
    stopBtnClicked = false;
    changeArrayBtns(false);
    await nextStepInAlg(arr, 0);
    drawArray();
    changeArrayBtns(true);

    async function nextStepInAlg(array, start) {
        if (array.length <= 1) return;
        drawArray();

        if (stopBtnClicked) {
            drawArray();
            changeArrayBtns(true);
            return;
        }

        let middle = Math.ceil(array.length / 2);

        let leftArr = array.slice(0, middle);
        let rightArr = array.slice(middle, arr.length);
        
        await nextStepInAlg(leftArr, start);
        await nextStepInAlg(rightArr, start + middle);

        // i to loop through left array, j to loop through right array, k to keep track of current index in real array
        let i = 0, j = 0, k = 0;
        while ((i < leftArr.length) && (j < rightArr.length)) {
            drawArray();
            highlightRect(start + j, 'orange');
            highlightRect(start + i, 'yellow');
            highlightRect(start + k, 'red');
            if (stopBtnClicked) {
                drawArray();
                changeArrayBtns(true);
                return;
            }
            await sleep(speed);
            // If left element is smaller, insert it and move left index up
            if (leftArr[i] < rightArr[j]) {
                array[k] = leftArr[i];
                arr[start + k] = leftArr[i];
                i++;
            // If right index is smaller, insert it and move right index up
            } else {
                array[k] = rightArr[j];
                arr[start + k] = rightArr[j];
                j++;
            }
            // Increase main array index
            k++;
        }

        // If there are any elements left after comparing, add them too (happens if main array has odd length)
        while (i < leftArr.length) {
            drawArray();
            highlightRect(start + j, 'orange');
            highlightRect(start + i, 'yellow');
            highlightRect(start + k, 'red');
            if (stopBtnClicked) {
                drawArray();
                changeArrayBtns(true);
                return;
            }
            await sleep(speed);
            array[k] = leftArr[i];
            arr[start + k] = leftArr[i];
            i++;
            k++;
        }
        while (j < rightArr.length) {
            drawArray();
            highlightRect(start + j, 'orange');
            highlightRect(start + i, 'yellow');
            highlightRect(start + k, 'red');
            if (stopBtnClicked) {
                drawArray();
                changeArrayBtns(true);
                return;
            }
            await sleep(speed);
            array[k] = rightArr[j];
            arr[start + k] = rightArr[j];
            j++;
            k++;
        }

        // Syncronous function to sleep without stopping browser
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}

// Function that visualizes Bubble Sort
function bubbleSort() {
    stopBtnClicked = false;
    let i = 0, j = 0;
    changeArrayBtns(false);
    // We use this to terminate algorithm if array is sorted before alg is finished.
    let swapsInCycle = 0;

    let nextStepInAlg = function() {
        drawArray();
        highlightRect(j, 'red');

        if (arr[j] > arr[j + 1]) {
            highlightRect(j + 1, 'orange');
            // Swap
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapsInCycle++;
        }

        if ((i == arr.length - 1 && j == arr.length - 1) || stopBtnClicked) {
            drawArray();
            changeArrayBtns(true);
            return;
        } else if (j == arr.length - 1) {
            if (swapsInCycle == 0) {
                drawArray();
                changeArrayBtns(true);
                return;
            }
            swapsInCycle = 0;
            i++;
            j = 0;
            setTimeout(nextStepInAlg, speed);
        } else if (j < arr.length - 1) {
            j++;
            setTimeout(nextStepInAlg, speed);
        }
    }

    nextStepInAlg();
    changeArrayBtns(true);
}

// Function that visualizes Insertion Sort
function insertionSort() {
    stopBtnClicked = false;
    changeArrayBtns(false);
    let i = 0, j = 0;

    let nextStepInAlg = function() {
        drawArray();
        highlightRect(j, 'red');

        if (arr[j] < arr[j - 1]) {
            // Swap
            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        } else {
            j = 0;
        }

        if ((i == arr.length - 1 && j == 0) || stopBtnClicked) {
            drawArray();
            changeArrayBtns(true);
            return -1;
        } else if (j == 0) {
            i++;
            j = i;

            setTimeout(nextStepInAlg, speed);
        } else {
            j--;
            setTimeout(nextStepInAlg, speed);
        }
    }

    nextStepInAlg();
}

// Function that visualises Selection Sort
function selectionSort() {
    stopBtnClicked = false;
    let i = arr.length - 1, j = 0;
    changeArrayBtns(false);
    let biggest = 0;
    let indexOfBiggest = -1;

    let nextStepInAlg = function() {
        drawArray();
        highlightRect(i, 'orange');
        highlightRect(j, 'red');

        if (arr[j] > biggest) {
            biggest = arr[j];
            indexOfBiggest = j;
        }

        if (i == 0 || stopBtnClicked) {
            drawArray();
            changeArrayBtns(true);
            return -1;
        } else if (j == i) {
            arr[indexOfBiggest] = arr[i];
            arr[i] = biggest;
            j = 0;
            i--;
            biggest = 0;
            setTimeout(nextStepInAlg, speed);
        } else {
            j++;
            setTimeout(nextStepInAlg, speed);
        }
    }

    nextStepInAlg();
}

function changeArrayBtns(enable) {
    if (enable) {
        document.querySelectorAll('.alg-btn').forEach(button => button.disabled = false);
    } else {
        document.querySelectorAll('.alg-btn').forEach(button => button.disabled = true);
    }
}

function highlightRect(index, color) {
    let xOfRect = margin / 2 + index * gapPixels + index * rectWidth;
    visuArr.fillStyle = color;
    // Array stores procentage of canvas height that rect takes up
    let rectHeight = arr[index] * canvas.height / 100;
    visuArr.fillRect(xOfRect, canvas.height - rectHeight, rectWidth, rectHeight);
}