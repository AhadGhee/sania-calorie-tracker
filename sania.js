
const eaten = document.getElementById("eaten");
const burned = document.getElementById("burned");
const calorieForm = document.getElementById("calorieForm");
const resultsDiv = document.getElementById("results");
let dailyCalorieLimit = 200;
const progressFill = document.querySelector(".progress-fill"); // the colored that fills up


// This code runs once when the page is fully loaded

window.addEventListener("load", function(){
    // Step1: retrieve the stored image index from localStorage

    const savedIndex = this.localStorage.getItem("saniaImageIndex");

    //step 2: if a value was found, update the iamge source

    if(savedIndex !== null)
    {
        // get the image element
        const imageElement = this.document.getElemenetById("saniaImage");

        // set the image to the saved version using the index

        imageElement.src = `sania${savedIndex}.JPG`;
    }
});



function askUserForCalorieLimit() {
    let userLimit;


    //  This starts an infinite loop that we’ll break when input is valid
    
        //  Prompt the user for input (string)
        userLimit = prompt("What's your daily calorie limit BIG BACK?", "500");

        //  If user hits cancel, default to 500 and exit loop
        if (userLimit === null) {
            userLimit = 500;
            
        }

        //  Convert to number
        userLimit = Number(userLimit);

        //  Check if it's a valid number using !isNaN()
        if (!isNaN(userLimit) && userLimit >= 500) {
            userLimit = userLimit; // input is valid — exit the loop
        } else {
            //  Invalid input — show message and loop again
            alert("Please enter a number greater than or equal to 500. You def eating more than that..");
        }

    

    dailyCalorieLimit = userLimit;
    localStorage.setItem("dailyCalorieLimit", userLimit);
    document.getElementById("dailyLimitValue").textContent = userLimit; //giving the span elemetn this value 

}



//
// This function updates the image of Sania based on how many calories she has eaten today.
function updateSaniaImage(eatenToday){
    //calorie thresholds for each image level

    const thresholds = [0, 800, 1600, 2400, 3200, 4000, 4800];
    //default image index will be 0
    let index = 0;

    //loop through and check where today's intake fits

    for (let i = 0; i<thresholds.length; i++){
        if(eatenToday >= thresholds[i]){
            index = i;
            console.log(index);
        }
    }
    // get teh img element where sania's picture is shown 
    const imageElement = document.getElementById("saniaImage");

    //update the image source to use the correct version

    imageElement.src = `sania${index}.JPG`;
    
    //saving hte image index in local storage so it persists after refresh
    localStorage.setItem("saniaImageIndex", index);
}

// helper function - this function checks log data and returns how many calories sania has eaten today.
// it is useful so we can update the meter with total eaten amount for today 

function getTodayEatenCalories(){
    const today = new Date().toLocaleDateString(); // get today's date in readable format
    const todayEntry = logData.find(entry => entry.date === today); // find today's log entry
    return todayEntry ? todayEntry.eaten : 0; // if found, rreturn the eaten calories, if not return 0 
}



changeLimitBtn.addEventListener("click", event => {
    event.preventDefault(); // prevent any form submission or refresh

    // ask the user for a new calorie limit once button is pressed

    let newLimit = prompt("Enter your new daily calorie limit: ", dailyCalorieLimit);

    //if user cancesl or enter nothing, do nothing
    if (newLimit === null || newLimit.trim() === "") return;

    newLimit = Number(newLimit);

    if (isNaN(newLimit) && newLimit < 500) {
        alert("Please enter a number greater than or equal to 500. You def eating more than that..");
        return;
    } 
    
    dailyCalorieLimit = newLimit; //saving the new limit to global vairable

    // update the displayed limit in the html
    document.getElementById("dailyLimitValue").textContent = dailyCalorieLimit;
    // save it to local storate so it is rememebr next time 
    localStorage.setItem("dailyLimit", dailyCalorieLimit);


    updateCalorieMeter(getTodayEatenCalories());

})


let storedLimit = localStorage.getItem("dailyCalorieLimit");
if(storedLimit < 300)
{
    dailyCalorieLimit = Number(storedLimit);
    document.getElementById("dailyLimitValue").textContent = dailyCalorieLimit;
}
else {
    window.addEventListener("load", function(){
        this.setTimeout(() => {
            askUserForCalorieLimit();
        }, 3000);
    });
    //askUserForCalorieLimit



}


/// Progress Fill Function //////

function updateCalorieMeter(eatenToday){
    const fill = document.querySelector(".progress-fill"); // get the progress bar element

    const percentage = (eatenToday / dailyCalorieLimit) * 100;

    //limit the bar to 100% max 
    const safePercentage = Math.min(percentage, 100);

    fill.style.width = `${safePercentage}%`;

    // change color if over limit
    fill.style.backgroundColor = percentage > 100 ? "red" : "rgb(66, 54, 8)";
}


//Adding Calorie log to local storage, so it wont dissapear
//Step 1: Load previous data from LocalStorage or start fresh
    // Try to load existing log from browser storage. If nothing exists, use empty array as default
    //JSON.parse() method that coverts a string into javscript obejct 
let logData = JSON.parse(localStorage.getItem("calorieLog")) || [];

//Step 2: Render data to the screen
// This function will loop through all log entries and create visual list elements for them. 
function renderLog(){
    logList.innerHTML =""; //clear out any existing <li> elements in the logList

    //loop through each log entry and build it visually
    logData.forEach((entry, index) => {
        const logItem = document.createElement("li"); // Create a new list item

        const dateSpan = document.createElement("span"); // Create span for the date
        dateSpan.textContent = `Day ${index + 1} - ${entry.date}`; // Set text: Day number + date
        logItem.appendChild(dateSpan); // Add to the row

        const eatenSpan = document.createElement("span"); // Create span for calories eaten
        eatenSpan.textContent = entry.eaten; // Set text to stored value
        logItem.appendChild(eatenSpan); // Add to the row

        const burnedSpan = document.createElement("span"); // Create span for calories burned
        burnedSpan.textContent = entry.burned; // Set text to stored value
        logItem.appendChild(burnedSpan); // Add to the row

        const surplusSpan = document.createElement("span"); // Create span for surplus (eaten - burned)
        surplusSpan.textContent = entry.surplus; // Set text to stored value
        logItem.appendChild(surplusSpan); // Add to the row

        logList.appendChild(logItem); // Finally, add the entire <li> row to the <ul>

    });
}
// ==== STEP 3: Run Render Function on Page Load ====
// This ensures that any saved data in localStorage appears right when the site loads
renderLog();
updateCalorieMeter(getTodayEatenCalories());





calorieForm.addEventListener("submit", event => {
    event.preventDefault();

    //1. getting the input values 
    const eatenInput = Number(eaten.value); 
    const burnedInput = Number(burned.value);
    const remainder = eatenInput - burnedInput;


    //resultsDiv.textContent = `Sania’s calorie surplus is: ${remainder}`;
    

    //Preparing the date
    const today = new Date().toLocaleDateString(); //gets todays date, and converts it to string
    const logList = document.getElementById("logList"); //gets the list (Calorie list)
    const lastRow = logList.lastElementChild; //Get the last row in the list — might be null if it’s empty

    
    let lastDateText = ""; //will hold lastDateText from lastRow
    
    let lastRowDateCell;

    if(lastRow){ //If there's a last row, get the first element (date)
        lastRowDateCell = lastRow.querySelector("span"); // gets first<span> in the row
        lastDateText = lastRowDateCell.textContent; //get the last row's text content. 
    }



    if(lastDateText.includes(today)){ // if the date of the last row == today 
        // ✅ It's the same day — update the existing row
        // if the last day text is the same is todays
        const spans = lastRow.querySelectorAll("span"); //gets all of the spans in the last row

        // Read the current values in the row
        const oldEaten = Number(spans[1].textContent);   // Previously logged eaten, bc you enter as a string value 
        const oldBurned = Number(spans[2].textContent);  // Previously logged burned bc you enter as a string value 
        const oldSurplus = Number(spans[3].textContent); // Previously logged surplus bc you enter as a string value 

        // Add today's inputs to the existing values
        spans[1].textContent = oldEaten + eatenInput;       // Update eaten column
        spans[2].textContent = oldBurned + burnedInput;     // Update burned column
        spans[3].textContent = oldSurplus + remainder;      // Update surplus column

        // ==== Keep the data in localStorage in sync ====
        // Get the index of the last object in our logData array
        // Update the corresponding object in logData
        // We are adding the new input values to whatever was already there
/*         logData[lastIndex].eaten +=eatenInput; //update the eaten value in the data array 
        logData[lastIndex].burned +=burnedInput;
        logData[lastIndex].surplus +=remainder

 */
        

        const lastEntry = logData[logData.length -1] // grabs the latest entry
        
        lastEntry.eaten += eatenInput;
        lastEntry.burned += burnedInput;
        lastEntry.surplus += remainder;
        let Sup = lastEntry.surplus;

        console.log(Sup);

        resultsDiv.textContent = `Sania’s calorie surplus is: ${Sup}`;


        localStorage.setItem("calorieLog",JSON.stringify(logData)); //saving it as string

        // After updating today's row or adding a new one:

        

        updateCalorieMeter(getTodayEatenCalories());

        updateSaniaImage(getTodayEatenCalories());

    
        
        

    } 
    else {
        // IF its a different day 
        //date
        const logItem = document.createElement("li");  //create a new row or list item 
        const dateSpan = document.createElement("span");    //create a new data span element
        const dayNumber = logList.children.length + 1;
        dateSpan.textContent = `Day ${dayNumber} - ${today}`;
        logItem.appendChild(dateSpan);
        

        //eaten
        const eatSpan = document.createElement("span"); // creates new span element bc not the same date
        eatSpan.textContent = eatenInput;
        logItem.appendChild(eatSpan);

        // burned

        const burnedSpan = document.createElement("span");
        burnedSpan.textContent = burnedInput;
        logItem.appendChild(burnedSpan);

        //surplus
        const surplusSpan = document.createElement("span");
        surplusSpan.textContent = remainder;
        logItem.appendChild(surplusSpan);

        logList.appendChild(logItem); // add the finisehd row to the log 

        // After updating today's row or adding a new one:
  

        // Creates new object with today's data and adds it to the array we're storig 
        logData.push({
            date: today, eaten: eatenInput, burned: burnedInput, surplus: remainder
        })

        localStorage.setItem("calorieLog", JSON.stringify(logData)); // were converting the array to a string using JSON.stringify because localStorage can only store strings



        //  Get today's total eaten value from the **last** object in the logData array
        // logData[logData.length - 1] gives us the last entry added (today's entry).
        // .eaten gets the total calories eaten for that day.
        const totalEatenToday = logData[logData.length-1].eaten;

        // call the function that fills them eter, passing today's eatne value as innput
        updateCalorieMeter(getTodayEatenCalories());
        updateSaniaImage(getTodayEatenCalories());

    }
    



    eaten.value = "";
    burned.value = "";

});

const resetLogButton = document.getElementById("resetLog");

// ==== STEP 5: Handle Reset Log Button Click ====
resetLogButton.addEventListener("click", event => {
    event.preventDefault(); // Prevent default button behavior (form submission)

    localStorage.removeItem("calorieLog"); // Remove the key from localStorage
    logData = []; // Clear the in-memory log array
    renderLog(); // Re-render the log (it will be empty now)
    resultsDiv.textContent = ""; // Clear the result display





    

    const fill = document.querySelector(".progress-fill"); // get the progress bar element

    

    //limit the bar to 100% max 
    

    fill.style.width = ``;

    // change color if over limit

    const imageElement = document.getElementById("saniaImage");

    //update the image source to use the correct version

    imageElement.src = `sania${0}.JPG`;
    



});

/* window.addEventListener("load", function () {
    // Delay before showing the calorie log (500ms = 0.5s)
    setTimeout(() => {
        const logContainer = document.getElementById("calorieLogContainer");

        // Make sure the element exists before changing classes
        if (logContainer) {
            logContainer.classList.remove("hidden"); // remove the invisible class
            logContainer.classList.add("show");      // trigger the CSS animation
        }
    }, 500);
});
 */





// What JSON.stringify() Really Does:
//It converts a JavaScript object or array into a JSON-formatted string.
//localstorage can only store strings