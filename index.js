
// Les critères de sélection pour les pays.
// Nous enregistrons seulement les critères, et non pas la liste des pays.
// Puis dans la fonction de style, nous utilisons ces critères pour décider
// si on affiche ou non un pays.
// Un dictionnaire vide veut dire qu'il n'y a pas de sélection.
var selection = {};

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
  var selectedCountry = countryIsSelected(feature);
	return {
		fillColor: selectedCountry ? '#ff0000' : "#E3E3E3",
		weight: 1,
		opacity: 0.4,
		color: 'white',
		fillOpacity: selectedCountry ? 0.7 : 0.3
	};
}

function anyFilterIsActive(){
  if (selection['activity-type']) return true;
  return false;
}

function countryIsSelected(feature) {
  // If no filter, define the country as selected if there is an activity inside.
  if (anyFilterIsActive() == false) {
    return (typeof(feature.properties.accronym) != 'undefined');
  }

  // We have filters active; apply them.
  if (
    selection['activity-type'] && 
    selection['activity-type'] == feature.properties.accronym
  ) {
    return true;
  }

  // Par défaut, on retourne false
  return false;
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
    var html = '';

    // in case there is no iniative in a country, display a message
    // instead of a undefined table
    if (typeof(feat.properties.nomactivite) == 'undefined') {
      html = '<p>No initiative found for ' + feat.properties.name + '.</p>';
      $('.initiative_info').html(html);
      return;
    }

    // Display the initatives in the country:
    // *** TODO ***: Is it possible to have more than one initative in a country?
    //               Create a loop in this case...
    html = '<table cellpadding="5">';
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

$(document).ready(function(){
  $(".activity-type").on('click', function(e){

    // Désactiver le bouton s'il est activé:
    if ($(e.target).hasClass('active')) {
      $(e.target).removeClass('active');
      selection['activity-type'] = null;
      updateCountryLayer();
      return;
    }

    // Afficher que l'activité actuelle est active
    $('.activity-type').removeClass('active');
    $(e.target).addClass('active');

    // Extraire le type d'activité du "bouton" cliqué.
    var activityType = $(e.target).attr('data-accronym');

    // Définir le critère de sélection qui est utiliser pour dessiner les pays plus tard.
    selection['activity-type'] = activityType;

    // Redessiner la couche des pays.
    updateCountryLayer();
  });
});


function updateCountryLayer(){
  countryLayer.remove();
  countryLayer.setStyle(countryLayerStyleFn);
  countryLayer.addTo(mymap);
}
