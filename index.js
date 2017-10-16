var selectedCountries = [];
var selectedCountriesGEODARMA = [];
var selectedCountriesGSNL = [];

//settings de la carte
var mymap = L.map("map").setView([30.524, 1], 1.2);
mymap.setMaxBounds([[84.943837, -178.036194], [-84.770528, 177.599487]]);
mymap.setMinZoom(0.5);

//coordonnées
mymap.on('mousemove', function(e){
  var coord = e.latlng;
  $('#Coordinates').html('Coordinates: ' + coord.lat.toFixed(3) + ' / '+ coord.lng.toFixed(3));
});

//ajout de la carte
var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});
osmLayer.addTo(mymap);

//Echelle
L.control.scale({imperial:false, position: 'bottomleft'}).addTo(mymap);

//Highlight gris des polygones en passant la souris
function countryLayerStyleFn(feature) {
  var selectedCountry = (selectedCountries.indexOf(feature.id) > -1);
		return {
			fillColor: selectedCountry ? '#ff0000' : "#E3E3E3",
			weight: 1,
			opacity: 0.4,
			color: 'white',
			fillOpacity: selectedCountry ? 0.7 : 0.3
		};
}

var countryLayer = L.geoJson(zoneofaction, {
		onEachFeature: onEachFeature,
		style : countryLayerStyleFn
	}).addTo(mymap);

	function onEachFeature(feature, layer){
		layer.on({
			click : onCountryClick,
			mouseover : onCountryHighLight,
			mouseout : onCountryMouseOut
		});
	}

function onCountryMouseOut(e){
  	countryLayer.resetStyle(e.target);
}

function onCountryHighLight(e){
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }

  var countryCode = e.target.accronym;
//callback when mouse enters a country polygon goes here, for additional actions
}

function onCountryClick(e){
  //callback for clicking inside a polygon
    var feat = e.target.feature;
    var html = '<table cellpadding="5">';
    html += '     <tr>';
    html += '       <td><b>Name:</b></td>';
    html += '       <td><b>Description:</b></td>';
    html += '       <td><b>Related Initiatives:</b></td>';
    html += '     </tr>';
    html += '     <tr>';
    html += '       <td VALIGN="TOP"><h2>' + feat.properties.nomactivite + '</td></h2>';
    html += '       <td VALIGN="TOP">' + feat.properties.descr + '</td>';
    html += '       <td VALIGN="TOP">' + feat.properties.link + '</td>';
    html += '     </tr>';
    html += '    </table>';
    $('.initiative_info').html(html);
}

// $('.block-bottom-left td').on("click", function(e){
//   var id_disasters = $('.block-bottom-left td').val();
//   if (id_disasters == "") return;
//
//   // selectedCountries = ['AFG','AGO','ALB','ARE','ARG','ARM'];
//   // updateCountryLayer();
//   selectedCountriesGEODARMA = ['AFG','AGO'];
//   updateCountryLayer();
//   selectedCountriesGSNL = ['ALB','ARE','ARG','ARM']
//
// });

$(document).ready(function(){
  $("button").click(function(){
    var id_disasters = $('.block-bottom-left td').val();
    if (id_disasters == "") return;

    // selectedCountries = ['AFG','AGO','ALB','ARE','ARG','ARM'];
    // updateCountryLayer();
    selectedCountriesGEODARMA = ['AFG','AGO'];
    updateCountryLayer();
    selectedCountriesGSNL = ['ALB','ARE','ARG','ARM']
  });
});


function updateCountryLayer(){
  countryLayer.remove();
  countryLayer.setStyle(countryLayerStyleFn);
  countryLayer.addTo(mymap);
}
