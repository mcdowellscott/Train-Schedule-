// Initialize Firebase
var config = {
  apiKey: "AIzaSyAtMuN752qE1mb4QHbDthQuZlF6DyM3KyM",
  authDomain: "train-scheduler-8b15e.firebaseapp.com",
  databaseURL: "https://train-scheduler-8b15e.firebaseio.com",
  projectId: "train-scheduler-8b15e",
  storageBucket: "train-scheduler-8b15e.appspot.com",
  messagingSenderId: "752448060367"
};
firebase.initializeApp(config);
// database initialization
let database = firebase.database();
// document ready function
$(document).ready(function() {

// intake data click function
    $("#submit").on("click", function(event) {

      event.preventDefault();
// train info object
    let trainInfo = {
      trainName: $("#train-name").val().trim(),
      destination: $("#destination").val().trim(),
      trainTime: $("#train-time").val().trim(),
      frequency: $("#frequency").val(),
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    }
// pushing train info object to database
    database.ref().push(trainInfo);
// clearing varialbes after click/enter
    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");

  });
// child added function
  database.ref().on("child_added", function(snapshot) {

  let name = snapshot.val().trainName;
  let dest = snapshot.val().destination;
  let frequencyVar = snapshot.val().frequency;
  let firstTrain = snapshot.val().trainTime;
// math to calculate next train arrival
  let firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  let remainder = diffTime % frequencyVar;
  let minutesTillTrain = frequencyVar - remainder;
  let nextTrain = moment().add(minutesTillTrain, "m").format("LT");
  console.log(minutesTillTrain);
  let newRow = $("<tr><td>" + name + "</td><td>" + dest + "</td><td>" + frequencyVar + "</td><td>" + nextTrain + "</td><td>" + minutesTillTrain + "</td></tr>");

  $("#table-body").append(newRow);

  });

});