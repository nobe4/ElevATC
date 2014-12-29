var slideBlock = false;

function slideInit(){
	$("#slide0").offset({ top: 0, left: 0 });

	$("#slide1").offset({ top: 0, left: - $( window ).width() });

	$("#slide2").offset({ top: 0, left: + $( window ).width() });

	$("#slide3").offset({ left: 0, top: - $( window ).height() });
}

function slideLeft(){
	if(!slideBlock){
		slideBlock = true;
		$( ".slide" ).animate({
			left: "+=" + $( window ).width()
		}, 1500, "swing", function() {
			slideBlock = false;
		});
	}
}
$(".slideLeft").click(slideLeft);

function slideRight(){
	if(!slideBlock){
		slideBlock = true;
		$( ".slide"  ).animate({
			left: "-=" + $( window  ).width()
		}, 1500, "swing", function() {
			slideBlock = false;
		});
	}
}
$(".slideRight").click(slideRight);

function slideUp(){
	if(!slideBlock){
		slideBlock = true;
		$( ".slide"  ).animate({
			top: "+=" + $( window  ).height()
		}, 1500, "swing", function() {
			$("#atc-audio")[0].play();
			$("#music-audio")[0].play();
			slideBlock = false;
		});
	}
}
$(".slideUp").click(slideUp);

function slideDown(){
	if(!slideBlock){
		slideBlock = true;
		$("#atc-audio")[0].pause();
		$("#music-audio")[0].pause();
		$( ".slide"  ).animate({
			top: "-=" + $( window  ).height()
		}, 1500, "swing", function() {
			slideBlock = false;
		});
	}
}
$(".slideDown").click(slideDown);
