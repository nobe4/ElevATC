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

	$("#pause").click(function(){
		$("#atc-audio")[0].pause();
		$("#music-audio")[0].pause();
	});
});
