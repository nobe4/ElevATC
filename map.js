// Create map object
var geojson = generateGeoJson("data.json")
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 3, maxZoom:9, attribution: osmAttrib});
var map = L.map('map').setView([48.72551, 2.359443], 3);
map.addLayer(osm);
var airportLayer = L.geoJSON(
	generateGeoJson("data.json"),
	{
		onEachFeature: createAirportPopup,
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				color: "#ffffff",
				fillColor: "#1e8bc3",
				weight: 1,
				opacity: 1,
				fillOpacity: 1
			})
		}
	}
).addTo(map);

function createAirportPopup(feature, layer){
	if (feature.properties && feature.properties.fName) {
		let text = ""
		if( Object.prototype.toString.call( feature.properties.stream ) === '[object Array]'){
			text += "<ul>"
			for(i=0; i<feature.properties.stream.length; i++) {
				let stream = feature.properties.stream[i]
				text += "<li class='popupChoice' name='"+ feature.properties.fName +"' url='"+ stream.URLName +"'>" + stream.Description + "</li>"
			}
			text += "</ul>"
		}
		else{
			text = "<span class='popupChoice' name='"+ feature.properties.fName +"' url='"+ feature.properties.stream.URLName +"'>" + feature.properties.stream.Description + "</span>";
		}
		layer.bindPopup(text);
    }
}

//	Generate GeoJson data from basic json
function generateGeoJson(url){
	var returnVal = new Object();
	returnVal.type = "FeatureCollection";
	returnVal.features = new Array();

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		success: function( data ) {
			data.Airport.forEach(function(entry){
				returnVal.features.push(createAirportFeature(entry));
			});
		},
		data: {},
		async: false
	});

	return returnVal;
}

//	Create airport feature for map display
function createAirportFeature(airport){
	var feature = new Object();
	feature.type = "Feature";
	feature.geometry = new Object();
	feature.geometry.type = "Point";
	feature.geometry.coordinates =  [parseFloat(airport.Longitude), parseFloat(airport.Latitude)];
	feature.properties = new Object();
	feature.properties.name = airport.ICAO;
	feature.properties.fName = airport.FriendlyName;
	feature.properties.stream = airport.Stream;


	return feature;
}


// Handle popup airport selection click
$("#map").on('click', '.popupChoice', function(){
	$("#atc_src").attr("src", "http://d.liveatc.net/"+$(this).attr("url"));
	$("#atc-audio")[0].load();

	audio.atc.streamName = $(this).text();
	audio.atc.name = $(this).attr("name");

	setFrontPageValues();
	$("#popup").hide();

	Cookies.set('atcName', audio.atc.name, { expires: 7 });
	Cookies.set('atcSName', audio.atc.streamName, { expires: 7 });
	Cookies.set('stream', "http://d.liveatc.net/"+$(this).attr("url"), { expires: 7 });

	slideRight();
});