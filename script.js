$(function() {
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=plane&tagmode=any&format=json&jsoncallback=?", handleImages);

	function handleImages(data){
		var images = [];
		for(var index in data.items){
			var url = data.items[index].media.m.replace("_m","");
			images.push(url);
		}
		$.backstretch(images,{duration : 50000, fade:5000});
	}
	var atcAudio = 	$("#atc-audio")[0];
	var musicAudio = $("#music-audio")[0];
	var playPauseButton = $("#play-pause");
	var atcVolume = $("#atc-volume");
	var musicVolume = $("#music-volume");
	var volumes = {
		"atc" : 100,
		"music" : 100
	};
	var playing = true;

	// handle the click on the play/pause button
	playPauseButton.click(function(){
		if(playing){
			atcAudio.pause();
			musicAudio.pause();
		} else {
			atcAudio.play();
			musicAudio.play();
		}
		playing = !playing;
		playPauseButton.text(playing?"PAUSE":"PLAY");
	});

	// update audio and displayed volumes
	function updateVolumes(){
		// update audio volume
		atcAudio.volume = volumes.atc / 100.0;
		musicAudio.volume = volumes.music / 100.0;
		//update display
		atcVolume.text(volumes.atc);
		musicVolume.text(volumes.music);
	}

	// handle volume for atc
	atcVolume.click(function(){
		volumes.atc = (volumes.atc - 25 >= 0)?volumes.atc - 25:100;
		updateVolumes();
	});
	// handle volume for music
	musicVolume.click(function(){
		volumes.music = (volumes.music - 25 >= 0)?volumes.music - 25:100;
		updateVolumes();
	});
});
