$(document).ready(function () {
  var $placeAddress = $('#location').autocomplete({
      containerID: 'yandex_places'
    }),
    $placeTitle = $('#place_title').autocomplete({
      containerID: 'known_places'
    }),
    $autoPlaceAddress = $('#event_place_attributes_address'),
    $autoPlaceLatitude = $('#event_place_attributes_latitude'),
    $autoEventLongitude = $('#event_place_attributes_longitude'),
    $autoPlaceId = $('#event_place_attributes_id'),
    $place = $('#place_id'),
    searchLatency = 0.2;

  var model = {
    suggestedLocations: {
      ours: [],
      yandexs: []
    },
    approvedLocations: []
  };

  var controller = {
    clearSuggestions: function () {
      model.suggestedLocations = {
        ours: [],
        yandexs: []
      };
      $placeAddress.$autocomplete.clear();
      $placeTitle.$autocomplete.clear();
    },
    setYandexSuggestedLocations: function (locations) {
      model.suggestedLocations.yandexs = locations;
      updateSuggestions($placeAddress, locations);
    },
    setOursSuggestedLocations: function (locations) {
      model.suggestedLocations.ours = locations;
      updateSuggestions($placeTitle, locations);
    },
    approveSuggestion: function (location) {
      controller.reset();
      model.approvedLocations.push(location);
      if (location.place_title) {
        $placeTitle.val(location.place_title);
        $place.val(location.place_id);
      }
      $placeAddress.val(location.addressLine);
      $placeTitle.trigger('show-input');
      $placeAddress.trigger('show-input');
      Geocoder.buildMap('map', location);
      $('#map-trigger').show();
      $autoPlaceAddress.val(location.addressLine);
      $autoPlaceLatitude.val(location.coordinates[0]);
      $autoEventLongitude.val(location.coordinates[1]);
      $autoPlaceId.val(location.id);
    },
    reset: function () {
      model.suggestedLocations = {};
      model.approvedLocations = [];
      Geocoder.destroyMap();
      $('#map-trigger').hide();
      $autoPlaceAddress.val('');
      $autoPlaceLatitude.val('');
      $autoEventLongitude.val('');
      $autoPlaceId.val('');
    },
    hideContainers: function () {
      $placeAddress.$autocomplete.hide();
      $placeTitle.$autocomplete.hide();
    }
  };

  function updateSuggestions($input, objects) {
    $input.$autocomplete.clear();
    objects.forEach(function (object) {
      var label = [
        object.place_title,
        object.addressLine
      ].filter(function (n) {
        return n != undefined;
      }).join(', ');

      $input.$autocomplete.addItem(label, function () {
        controller.approveSuggestion(object);
        controller.clearSuggestions();
      });
    });
    $input.$autocomplete.show();
  }

  function bindGeocoder() {
    function addressValue() {
      return $placeAddress.val();
    }

    function titleValue() {
      return $placeTitle.val();
    }

    function searchOurs() {
      var addressInput = addressValue(),
        titleInput = titleValue();
      if (addressInput.length === 0 && titleInput.length === 0) {
        return;
      }
      Geocoder.searchKnown(titleInput, controller.setOursSuggestedLocations);
    }

    function searchYandex() {
      var addressText = addressValue();
      if (addressText.length === 0) {
        return;
      }
      Geocoder.searchByGeocoder(addressText, controller.setYandexSuggestedLocations);
    }

    function defer(func) {
      return function () {
        setTimeout(func, searchLatency);
      };
    }

    $placeAddress.on('input', defer(searchYandex));
    $placeAddress.on('focus', defer(searchYandex));
    $placeTitle.on('input', defer(searchOurs));
    $placeTitle.on('focus', defer(searchOurs));
  }

  $('body').on('click', function () {
    controller.hideContainers();
  });

  Geocoder.ready(bindGeocoder);
});
