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

	var playing = true;

	console.log(playPauseButton);
	playPauseButton.click(function(){
		if(playing){
			atcAudio.pause();
			musicAudio.pause();
		} else {
			atcAudio.play();
			musicAudio.play();
		}
		playing = !playing;
		console.log(playing);
		playPauseButton.text(playing?"PAUSE":"PLAY");
	});
});
