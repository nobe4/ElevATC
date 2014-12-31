//	Global Variables
var audio = {
	"playing": true,
	"atc": {
		"name": "Paris",
		"streamName": "LFPO Departure",
		"freq": "127.750", // Currently not used
		"url": "",
		"volume": 100
	},
	"music": {
		"name": "Elevator Music",
		"url": "elevator.mp3",
		"volume": 100
	}
};

var atcAudio = 	$("#atc-audio")[0];
var musicAudio = $("#music-audio")[0];
var playPauseButton = $("#playpauseImg");
var atcVolume = $("#atc-volume");
var musicVolume = $("#music-volume");

// Load and populate music List
jQuery.getJSON("musicList.json", function(data){
	data.musicList.forEach(function(entry){
		$("#musicSelector-list").append('<li class="musicSelector-listElement" data="'+entry.url+'">'+entry.name+'</li>');
	});
});

$(function() {
	// Init sliding
	slideInit();

	// Volume cookies
	audio.atc.volume = (loadCookie("atcVolume") != false ? loadCookie("atcVolume") : audio.atc.volume);
	audio.music.volume = (loadCookie("musicVolume") != false ? loadCookie("musicVolume") : audio.music.volume);

	// Stream cookies
	audio.atc.name = (loadCookie("atcName") != false ? loadCookie("atcName") : audio.atc.name);
	audio.atc.streamName = (loadCookie("atcSName") != false ? loadCookie("atcSName") : audio.atc.streamName);
	if(loadCookie("atcStream")){
		audio.atc.url = (loadCookie("atcStream") != false ? loadCookie("atcStream") : audio.atc.url);
		loadStream("atc-audio", audio.atc.url);
	}

	// Music cookies
	audio.music.name = (loadCookie("musicUrl") != false ? loadCookie("music") : audio.music.name);
	if(loadCookie("musicUrl")){
		audio.music.url = (loadCookie("musicUrl") != false ? loadCookie("musicUrl") : audio.music.url);
		loadStream("music-audio", audio.music.url);
	}

	// Update Values
	updateVolumes();
	setFrontPageValues();

	// Remove the loading screen
	$( "#loadingScreen" ).fadeOut( "slow", function() {});
})

// Grab images from flickr
$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=airplane&tagmode=any&format=json&jsoncallback=?", handleImages);

//	Backstretch
function handleImages(data){
	var images = [];
	for(var index in data.items){
		var url = data.items[index].media.m.replace("_m","");
		images.push(url);
	}
	$("#slide3").backstretch(images,{duration : 50000, fade:5000});
}

// Load cookie
// Return false if the cookie is empty
function loadCookie (cookie){
	cookie = $.cookie(cookie)
	if( cookie != undefined)
		return cookie;
	else
		return false;
}

// Load New stream in audio
function loadStream (container, url){
	if(url != "none.mp3")
		$("#"+container+" source").attr("src", "music/"+url);
	else
		$("#"+container+" source").attr("src", "");
	$("#"+container)[0].load();
}

// update audio and displayed volumes
function updateVolumes(){
	//	ATC
	atcAudio.volume = audio.atc.volume / 100.0;
	$("#atc-control").attr("volume", audio.atc.volume);

	//	Music
	musicAudio.volume = audio.music.volume / 100.0;
	$("#music-control").attr("volume", audio.music.volume);
}

// Set front page values
function setFrontPageValues(){
	$("#ATCName").html(audio.atc.name.replace(/\//g, "<wbr>/<wbr>"));
	$("#ATCSName").html(audio.atc.streamName.replace(/\//g, "<wbr>/<wbr>"));
	$("#ATCFreq").text(audio.atc.freq);

	$("#Music").text(audio.music.name);
	$("#musicSelector-displayMusic").text(audio.music.name);
}

// Music Selector Collapse
function collapseSelector(){
	if($("#musicSelector").attr("collapsed") == "true"){
		$("#musicSelector").attr("collapsed", "false");
		$("#musicSelector-collapse").html("&#9650;");
	}
	else{
		$("#musicSelector").attr("collapsed", "true");
		$("#musicSelector-collapse").html("&#9660;");
	}
}

// handle the click on the play/pause button
playPauseButton.click(function(){
	if(audio.playing){
		atcAudio.pause();
		musicAudio.pause();
	} else {
		atcAudio.play();
		musicAudio.play();
	}
	audio.playing = !audio.playing;
	playPauseButton.attr("src",'img/' + (audio.playing?"pause":"play") + '.svg');
});

// handle volume for atc
atcVolume.click(function(){
	audio.atc.volume = (audio.atc.volume - 25 >= 0)?audio.atc.volume - 25:100;
	$.cookie('atcVolume', audio.atc.volume, { expires: 7 });	// Set cookie
	updateVolumes();
});

// handle volume for music
musicVolume.click(function(){
	audio.music.volume = (audio.music.volume - 25 >= 0)?audio.music.volume - 25:100;
	$.cookie('musicVolume', audio.music.volume, { expires: 7 });	// Set cookie
	updateVolumes();
});

// handle click on music selector
$("#musicSelector-display").click(function(){
	collapseSelector();
});

// Handle music selection
$("#musicSelector").on('click', '.musicSelector-listElement', function(){
	audio.music.name = $(this).text();
	audio.music.url = $(this).attr("data") + ".mp3";

	collapseSelector();
	setFrontPageValues();

	// Set cookies
	$.cookie('music', audio.music.name, { expires: 7 });
	$.cookie('musicUrl', audio.music.url, { expires: 7 });

	loadStream("music-audio", audio.music.url);
});

// Handle resize
$(window).resize(function(){
	slideInit();
});

