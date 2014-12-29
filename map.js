var styleCache = {};

// Airpot dot layer
var vectorLayer = new ol.layer.Vector({
    source: new ol.source.GeoJSON({
        object: generateGeoJson("data.json")	// Generate GeoJson data from json(XML)
    }),
    style: function(feature, resolution) {
		var complete = resolution < 6000 ? true : false;
		var text = resolution < 6000 ? feature.get('name') : '';
		if(complete){
			if (!styleCache[text]) {
				styleCache[text] = [new ol.style.Style({
					image: new ol.style.Circle({
						fill: new ol.style.Fill({
							color: '#1e8bc3'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 1
						}),
						radius : 12,
					})
				})];
			}
		}
		else{
			styleCache[text] = [new ol.style.Style({
				image: new ol.style.Circle({
					fill: new ol.style.Fill({
						color: '#1e8bc3'
					}),
					stroke: new ol.style.Stroke({
						color: '#fff',
						width: 1
					}),
					radius : 8,
				})

			})];
		}
        return styleCache[text];
    }
});

// Popup Overlay
var popupOverlay = new ol.Overlay({
	element: $("#popup")
});

// Create map object
var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.MapQuest({
				layer: 'sat'
            })
        }),
        vectorLayer
    ],
    target: 'map',
//	renderer: 'webgl',
	overlays: [popupOverlay],
    view: new ol.View({
        center: [48.72551, 2.359443],
        zoom: 3,
		minZoom : 3,
		maxZoom : 9,
		extent: [-20037508.34,-20037508.34,20037508.34,20037508.34]
    })
});

var highlightStyleCache = {};


var featureOverlay = new ol.FeatureOverlay({
	map: map,
	style: function(feature, resolution) {
		var text = feature.get('name');
		if (!highlightStyleCache[text]) {
			highlightStyleCache[text] = [new ol.style.Style({
				text: new ol.style.Text({
					font: '30px Calibri,sans-serif',
					text: text,
					offsetY: -30,
					fill: new ol.style.Fill({
						color: '#1e8bc3'
					}),
					stroke: new ol.style.Stroke({
						color: '#000',
						width: 1
					}),
				}),
				image: new ol.style.Circle({
					fill: new ol.style.Fill({
						color: '#fff'
					}),
					stroke: new ol.style.Stroke({
						color: '#1e8bc3',
						width: 1
					}),
					radius : 12,
				})

			})];
		}
		return highlightStyleCache[text];
	}
});


var highlight;
function displayFeatureInfo(pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
    });

    if (feature !== highlight) {
        if (highlight) {
            featureOverlay.removeFeature(highlight);
        }
        if (feature) {
            featureOverlay.addFeature(feature);
        }
        highlight = feature;
    }

};

// Display airport popup
function onClickAirport(evt) {
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		return feature;
	});
	
	// If an airport is selected
	if(feature != null){
		audio.atc.name = feature.o.fName;
		
		// Refresh front page values
//		setFrontPageValues();
		
		popupOverlay.setPosition(evt.coordinate);		
		
		var text = "";	// Popup text
		if( Object.prototype.toString.call( feature.o.stream ) === '[object Array]'){
			text+="<ul>";
			for(i=0; i<feature.o.stream.length; i++)
				text += "<li class='popupChoice' url='"+ feature.o.stream[i].URLName +"'>" + feature.o.stream[i].Description + "</li>";
			text+="</ul>";
		}
		else{
			text = "<span class='popupChoice' url='"+ feature.o.stream.URLName +"'>" + feature.o.stream.Description + "</span>";
		}
		
		$("#popupContent").html( text );
		$("#popup").show();
	}
	else
		$("#popup").hide();
};

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

	return JSON.stringify(returnVal);
}

//	Create airport feature for map display
function createAirportFeature(airport){
	var feature = new Object();
	feature.type = "Feature";
	feature.geometry = new Object();
	feature.geometry.type = "Point";
	feature.geometry.coordinates =  ol.proj.transform([parseFloat(airport.Longitude), parseFloat(airport.Latitude)], 'EPSG:4326', 'EPSG:3857');
	feature.properties = new Object();
	feature.properties.name = airport.ICAO;
	feature.properties.fName = airport.FriendlyName;
	feature.properties.stream = airport.Stream;


	return feature;
}

// Handle map over event
$(map.getViewport()).on('mousemove', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

// Handle map click event
map.on('click', function(evt) {
	onClickAirport(evt);
});

// Handle popup airport selection click
$("#popup").on('click', '.popupChoice', function(){
	$("#atc_src").attr("src", "http://d.liveatc.net/"+$(this).attr("url")); 
	$("#atc-audio")[0].load();
	
	audio.atc.streamName = $(this).text();

	setFrontPageValues();
	$("#popup").hide();
	
	$.cookie('atcName', audio.atc.name, { expires: 7 });
	$.cookie('atcSName', audio.atc.streamName, { expires: 7 });
	$.cookie('stream', "http://d.liveatc.net/"+$(this).attr("url"), { expires: 7 });
	
	slideRight();
});