const NodeID3 = require('node-id3');
const fs = require('fs');
const async = require("async");
const mp3Duration = require('mp3-duration');

const directory = "C:/Users/Filipe Cruz/Videos/enrmp403_grid_resistor_-_alpha/";

let obj = [];
let counter = 0;
let counter_objective = 0;

let accumulative_time = true;

fs.readdir(directory, (err, files) => {
    counter_objective = files.length;
	//console.log(files.length);
	
	async.eachSeries(files, function iteratee(val, callback) {
		let extension = val.split('.').pop();
		//console.log(val);
		if (extension == "mp3") {
			console.log('reading ' + val);
			NodeID3.read(directory + val, function(err, tags) {
				let thesetags = tags;
				mp3Duration(directory + val, function (err, duration) {
				  if (err) return console.log(err.message);
				  //console.log('Your file is ' + duration + ' seconds long');
				  if (thesetags != undefined) obj.push({"trackNumber": thesetags.trackNumber, "duration": duration, "artist": thesetags.artist, "title": thesetags.title});
				  checkEnd();
				  callback();
				});
			})
		} else {
			checkEnd();
			callback();
		}
	});	
});


function checkEnd() {
	counter++;
	if (counter == counter_objective) {
		//console.log(obj);
		let acctime = 0;
		console.log('Tracklist:');
		obj.forEach(track => {
			if (accumulative_time == false) acctime = track.duration;
			console.log(("0" + track.trackNumber).slice(-2) + ') ' + track.artist + ' - ' + track.title + ' [' + (acctime+"").toHHMMSS() + ']');
			acctime += track.duration;
		});
	}
}
 
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}