$(function() {
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
