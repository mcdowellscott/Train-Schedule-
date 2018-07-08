// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAtMuN752qE1mb4QHbDthQuZlF6DyM3KyM",
    authDomain: "train-scheduler-8b15e.firebaseapp.com",
    databaseURL: "https://train-scheduler-8b15e.firebaseio.com",
    projectId: "train-scheduler-8b15e",
    storageBucket: "",
    messagingSenderId: "752448060367"
  };
  firebase.initializeApp(config);
// document ready function
$(document).ready(function() {
// database initialization
  let database = firebase.database();
// intake data click function
    $("#submit").on("click", function(event) {

      event.preventDefault();
// train info object
    let trainInfo = {
      trainName: $("#train-name").val().trim(),
      destination: $("#destination").val().trim(),
      trainTime: $("#train-time").val().trim(),
      frequency: $("#frequency").val(),
      minutesAway: 0,
      nextArrival: "2:00",
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
  let time = snapshot.val().nextArrival;
  let freq = snapshot.val().frequency;
  let minAway = snapshot.val().minutesAway;
  let startTime = snapshot.val().trainTime;
// math to calculate next train arrival
  let frequencyVar = freq;
  let firstTrain = startTime;
  let firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  let currentTime = moment().format("LT");
  let diffTime = moment().diff(moment(firstTrain), "minutes");
  let remainder = diffTime % frequencyVar;
  let minutesTillTrain = frequencyVar - remainder;
  let nextTrain = moment().add(minutesTillTrain, "minutes");

  minAway = minutesTillTrain;

  time = moment(nextTrain).format("hh:mm a");

  let newRow = $("<tr><td>" + name + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + time + "</td><td>" + minAway + "</td></tr>");

  $("#table-body").append(newRow);

  });

});