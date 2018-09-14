$(document).ready(function(){
	console.log("ready");

// Initialize Firebase
var config = {
	apiKey: "AIzaSyB4hvzBxY1hjE0LetnEO2v-cuc2y6h4DAw",
	authDomain: "train-scheduler-07-homework.firebaseapp.com",
	databaseURL: "https://train-scheduler-07-homework.firebaseio.com",
	projectId: "train-scheduler-07-homework",
	storageBucket: "train-scheduler-07-homework.appspot.com",
	messagingSenderId: "738665096453"
};

firebase.initializeApp(config);

var database = firebase.database();

var currentTime = moment().format('MMMM Do YYYY, hh:mm:ss a');
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

//button for adding trains
$("#add-train-btn").on("click", function (event) {
	console.log("button works");
	event.preventDefault();

	//grabs user input
	var trainName = $("#train-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var trainTime = moment($("#time-input").val().trim(), "h:mm");
	var trainFrequency = $("#frequency-input").val().trim();

	//local temporary object for storing train data
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency,
	};

	//uploads train data to database
	database.ref().push(newTrain);

	console.log("train added");

	//clears out text boxes
	$("#train-input").val("");
	$("#destination-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");
});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function (childSnapshot) {
	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainTime = childSnapshot.val().time;
	var trainFrequency = childSnapshot.val().frequency;

	//console log train info
	console.log(trainName);
	console.log(trainDestination);
	console.log(trainTime);
	console.log(trainFrequency);

	//train time conversion to military time
	var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
	console.log("Train Time Converted: " + trainTimeConverted);

	//time difference between trains
	var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
	console.log("Train time difference: " + diffTime);

	//determining frequency 
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	var tMinutesTillTrain = frequency - remainder;
	console.log("Minutes till train: " + tMinutesTillTrain);

	var nextTrain = moment().add(MtMinutesTillTrain, "minutes");
	console.log("Arrival time: " + moment(nextTrain).format("MMMM Do YYYY, h:mm:ss a"));

	//create new row
	var newRow = $("<tr>").append(
		$("<td>").text(trainName),
		$("<td>").text(trainDestination),
		$("<td>").text(trainTime),
		$("<td>").text(trainFrequency),
	);

	// Append the new row to the table
	$("#train-table > tbody").append(newRow);
});

}); 