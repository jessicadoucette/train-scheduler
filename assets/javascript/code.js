// Initialize Firebase
var config = {
	apiKey: "AIzaSyCJR7oNzRgeXZXqmEPylWLR-6n9a5S4cr0",
	authDomain: "new-train-project-f1bc7.firebaseapp.com",
	databaseURL: "https://new-train-project-f1bc7.firebaseio.com",
	projectId: "new-train-project-f1bc7",
	storageBucket: "",
	messagingSenderId: "882204237397"
};
firebase.initializeApp(config);

var trainData = firebase.database();

var currentTime = moment().format('MMMM Do YYYY, hh:mm:ss a');
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

//button for adding trains
$("#addTrainBtn").on("click", function (event) {
	console.log("button works");
	event.preventDefault();

	//grabs user input
	var trainName = $("#trainInput").val().trim();
	var trainDestination = $("#destinationInput").val().trim();
	var trainTime = moment($("#timeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
	var trainFrequency = $("#frequencyInput").val().trim();

	//local temporary object for storing train data
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		trainTime: trainTime,
		frequency: trainFrequency,
	};

	//uploads train data to database
	trainData.ref().push(newTrain);

	console.log("train added");
	alert("Train Added");

	//clears out text boxes
	$("#trainInput").val("");
	$("#destinationInput").val("");
	$("#timeInput").val("");
	$("#frequencyInput").val("");

	return false;
});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function (snapshot) {
	console.log(snapshot.val());

	// Store everything into a variable.
	var name = snapshot.val().name;
	var destination = snapshot.val().destination;
	var trainTime = snapshot.val().trainTime;
	var frequency = snapshot.val().frequency;

	//console log train info
	console.log(name);
	console.log(destination);
	console.log(trainTime);
	console.log(frequency);


	//train time conversion to military time
	var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
	console.log("Train Time Converted: " + trainTimeConverted);

	//time difference between trains
	var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
	console.log("Train time difference: " + diffTime);

	//determining frequency 
	var tRemainder = diffTime % frequency;
	console.log("Remaining time: " + tRemainder);

	var tMinutesTillTrain = frequency - tRemainder;
	console.log("Minutes till train: " + tMinutesTillTrain);

	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
	console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

	//create new row
	var newRow = $("<tr>").append(
		$("<td>").text(name),
		$("<td>").text(destination),
		$("<td>").text(frequency),
		$("<td>").text(nextTrain),
		$("<td>").text(tMinutesTillTrain)
	);
	console.log(newRow);
	// Append the new row to the table
	$("#trainTable > tbody").append(newRow);
});