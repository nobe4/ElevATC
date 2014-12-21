$(function() {
	$.backstretch("http://farm8.staticflickr.com/7517/15884137398_5fd8ac47c6.jpg");
	var index = 0;
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=plane&tagmode=any&format=json&jsoncallback=?",
						function(data){
							var images = [];
							for(var index in data.items){
								var url = data.items[index].media.m.replace("_m","");
								images.push(url);
							}
							$.backstretch(images,{duration : 50000, fade:5000});
						});
});
