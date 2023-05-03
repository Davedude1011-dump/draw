const firebaseConfig = {
  apiKey: "AIzaSyCBHwbAOPYRegTBD8e4Tnk2WjncStInYiQ",
  authDomain: "test-3e484.firebaseapp.com",
  databaseURL: "https://test-3e484-default-rtdb.firebaseio.com",
  projectId: "test-3e484",
  storageBucket: "test-3e484.appspot.com",
  messagingSenderId: "60185362193",
  appId: "1:60185362193:web:a8a517ee872167933896b0",
  measurementId: "G-YFEV58GMRB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const boxShell = document.getElementById("boxShell");
const colorPicker = document.getElementById("color-picker");
const colorPicker2 = document.getElementById("color-picker-2");
var selectedColor = "#000000"
var selectedColor2 = "#ffffff"

function rgbToHex(rgb) {
    // Separate RGB values and convert them to hexadecimal
    let rgbValues = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    let hex = "#" + ((1 << 24) + (parseInt(rgbValues[1]) << 16) + (parseInt(rgbValues[2]) << 8) + parseInt(rgbValues[3])).toString(16).slice(1).toLowerCase();
    return hex;
  }

colorPicker.addEventListener("change", (event) => {
    selectedColor = event.target.value
  console.log(selectedColor);
});
colorPicker2.addEventListener("change", (event) => {
    selectedColor2 = event.target.value
    console.log(selectedColor2);
});

var currentBoxSize = 10

function growBlock() {
    currentBoxSize += 4
    document.documentElement.style.setProperty('--boxSize', `${currentBoxSize}px`);
}
function shrinkBlock() {
    currentBoxSize -= 4
    document.documentElement.style.setProperty('--boxSize', `${currentBoxSize}px`);
}

function forLoopToCreateBoxes(parentElement, startingNum) {
    var oneInOneHoundred = 0
    for (let i = startingNum; i < startingNum+10000; i++) { //change to +20000 when going landscape
        db.ref(parentElement.toString() + "/box" + i.toString()).once("value").then(function(snapshot) {
            var newBox = document.createElement("div");
            newBox.onclick = function() {
                var boxNum = this.id
                try {
                    if (rgbToHex(this.style.backgroundColor) != selectedColor.toLowerCase()) {
                        db.ref(parentElement.toString() + "/box" + boxNum).set(selectedColor)
                        console.log("paiting to tile...")
                    }
                    else {
                        console.log("thats the same color...")
                    }
                }
                catch {
                    db.ref(parentElement.toString() + "/box" + boxNum).set(selectedColor)
                    console.log("paiting to tile...")
                }
            }
            newBox.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                var boxNum = this.id
                console.log("-> ", rgbToHex(this.style.backgroundColor))
                console.log("--> ", selectedColor2.toLowerCase())
                try {
                    if (rgbToHex(this.style.backgroundColor) != selectedColor2.toLowerCase()) {
                        db.ref(parentElement.toString() + "/box" + boxNum).set(selectedColor2)
                        console.log("paiting to tile...")
                    }
                    else {
                        console.log("thats the same color...")
                    }
                }
                catch {
                    db.ref(parentElement.toString() + "/box" + boxNum).set(selectedColor2)
                    console.log("paiting to tile...")
                }
            });
            newBox.style.backgroundColor = snapshot.val()
            newBox.id = i;
            newBox.classList.add("box");
            boxShell.appendChild(newBox);
            oneInOneHoundred++
            if (oneInOneHoundred === 100) { //change to 200 when going landscape
                boxShell.appendChild(document.createElement("br"))
                console.log(oneInOneHoundred)
                oneInOneHoundred = 0
            }
        })
    }
    db.ref(parentElement).on("child_changed", (snapshot) => {
        const boxNumber = snapshot.key.split("box")[1]; // extract the number from the key
        const boxValue = snapshot.val(); // get the value of the changed child
        console.log("box" + boxNumber + " changed to " + boxValue);
        document.getElementById(boxNumber).style.backgroundColor = boxValue
    });
}
function forLoopCreateSets(setName, length, startingNumber) {
    for (var i = startingNumber; i < startingNumber + length; i++) {
        db.ref(setName.toString() + "/box" + i.toString()).set("#FFFFFF")
        console.log(i)
    }
}

function loadBox() {
    forLoopToCreateBoxes("boxOuter1", 0)
}
loadBox()

function createEmptyBox() {
    forLoopCreateSets("boxOuter3", 20000, 0)
}
//createEmptyBox()