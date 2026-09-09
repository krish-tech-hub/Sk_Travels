/* =====================================================
   LEAFLET + OPENSTREETMAP LOCATION SELECTOR
===================================================== */

let map = null;
let marker = null;
let currentTarget = null;
let selectedLocation = null;

const pickupInput = document.getElementById("pickup");
const dropInput = document.getElementById("drop");

function updateTripSummary() {
  const fullName = document.getElementById("fullName");
  const phone = document.getElementById("phone");
  const pickupDate = document.getElementById("pickupDate");
  const pickupTime = document.getElementById("pickupTime");
  const tripType = document.getElementById("tripType");
  const passengers = document.getElementById("passengers");

  const summaryName = document.getElementById("summaryName");
  const summaryPhone = document.getElementById("summaryPhone");
  const summaryPickup = document.getElementById("summaryPickup");
  const summaryDrop = document.getElementById("summaryDrop");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");
  const summaryTrip = document.getElementById("summaryTrip");
  const summaryPassengers = document.getElementById("summaryPassengers");

  if (summaryName) {
    summaryName.textContent = fullName?.value || "-";
  }

  if (summaryPhone) {
    summaryPhone.textContent = phone?.value || "-";
  }

  if (summaryPickup) {
    summaryPickup.textContent = pickupInput?.value || "-";
  }

  if (summaryDrop) {
    summaryDrop.textContent = dropInput?.value || "-";
  }

  if (summaryDate) {
    summaryDate.textContent = pickupDate?.value || "-";
  }

  if (summaryTime) {
    summaryTime.textContent = pickupTime?.value || "-";
  }

  if (summaryTrip) {
    summaryTrip.textContent = tripType?.value || "-";
  }

  if (summaryPassengers) {
    summaryPassengers.textContent = passengers?.value || "-";
  }
}

const mapModal = document.getElementById("mapModal");
const mapOverlay = document.getElementById("mapModalOverlay");
const closeMapModal = document.getElementById("closeMapModal");
const mapModalTitle = document.getElementById("mapModalTitle");
const mapSearchInput = document.getElementById("mapSearchInput");
const currentLocationButton = document.getElementById("useCurrentLocation");
const mapElement = document.getElementById("googleMap");
const selectedLocationText = document.getElementById("selectedLocationText");
const confirmLocationButton = document.getElementById("confirmLocation");

const DEFAULT_LAT = 11.0168;
const DEFAULT_LNG = 76.9558;

/* =====================================================
   INITIALIZE LEAFLET MAP
===================================================== */

function initLeafletMap() {
  if (!mapElement) {
    console.error("Map element not found.");
    return;
  }

  if (typeof L === "undefined") {
    console.error("Leaflet library is not loaded.");
    return;
  }

  if (map) {
    setTimeout(function () {
      map.invalidateSize();
    }, 100);

    return;
  }

  map = L.map(mapElement, {
    center: [DEFAULT_LAT, DEFAULT_LNG],
    zoom: 13,
    zoomControl: true,
    attributionControl: true,
  });

  /* =====================================================
     OPENSTREETMAP TILES
  ===================================================== */

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  }).addTo(map);

  /* =====================================================
     MARKER
  ===================================================== */

  marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
    draggable: true,
  }).addTo(map);

  /* =====================================================
     MARKER DRAG
  ===================================================== */

  marker.on("dragend", function () {
    const position = marker.getLatLng();

    reverseGeocode(position.lat, position.lng);
  });

  /* =====================================================
     MAP CLICK
  ===================================================== */

  map.on("click", function (event) {
    setMapLocation(event.latlng.lat, event.latlng.lng);
  });
}

/* =====================================================
   SET MAP LOCATION
===================================================== */

function setMapLocation(lat, lng, address = "") {
  if (!map || !marker) {
    return;
  }

  const location = [lat, lng];

  marker.setLatLng(location);

  map.setView(location, 16, {
    animate: true,
  });

  if (address) {
    selectedLocation = {
      address: address,
      lat: lat,
      lng: lng,
    };

    updateSelectedLocationText(address);

    return;
  }

  reverseGeocode(lat, lng);
}

/* =====================================================
   REVERSE GEOCODING
===================================================== */

async function reverseGeocode(lat, lng) {
  try {
    updateSelectedLocationText("Finding location...");

    const url =
      "https://nominatim.openstreetmap.org/reverse" +
      "?format=jsonv2" +
      "&lat=" +
      encodeURIComponent(lat) +
      "&lon=" +
      encodeURIComponent(lng) +
      "&zoom=18" +
      "&addressdetails=1";

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Reverse geocoding request failed");
    }

    const data = await response.json();

    const address = data.display_name || "Selected map location";

    selectedLocation = {
      address: address,

      lat: lat,

      lng: lng,
    };

    updateSelectedLocationText(address);
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    selectedLocation = {
      address: "Selected map location",

      lat: lat,

      lng: lng,
    };

    updateSelectedLocationText("Selected map location");
  }
}

/* =====================================================
   SEARCH LOCATION
===================================================== */

async function searchLocation(query) {
  if (!map || !query) {
    return;
  }

  try {
    updateSelectedLocationText("Searching location...");

    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=jsonv2" +
      "&q=" +
      encodeURIComponent(query) +
      "&countrycodes=in" +
      "&limit=1" +
      "&addressdetails=1";

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Location search request failed");
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      updateSelectedLocationText("Location not found");

      alert("Location not found. Please try another search.");

      return;
    }

    const result = results[0];

    const lat = parseFloat(result.lat);

    const lng = parseFloat(result.lon);

    const address = result.display_name || query;

    setMapLocation(lat, lng, address);
  } catch (error) {
    console.error("Location search error:", error);

    updateSelectedLocationText("Search failed");

    alert("Unable to search location right now. Please try again.");
  }
}

/* =====================================================
   SEARCH INPUT
===================================================== */

if (mapSearchInput) {
  mapSearchInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const query = mapSearchInput.value.trim();

    if (!query) {
      return;
    }

    searchLocation(query);
  });
}

/* =====================================================
   CURRENT LOCATION
===================================================== */

if (currentLocationButton) {
  currentLocationButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");

      return;
    }

    currentLocationButton.disabled = true;

    currentLocationButton.innerHTML = `
        <i class="bi bi-hourglass-split"></i>
        Locating...
      `;

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;

        const lng = position.coords.longitude;

        setMapLocation(lat, lng);

        currentLocationButton.disabled = false;

        currentLocationButton.innerHTML = `
            <i class="bi bi-crosshair"></i>
            Current location
          `;
      },

      function (error) {
        console.error("Geolocation error:", error);

        currentLocationButton.disabled = false;

        currentLocationButton.innerHTML = `
            <i class="bi bi-crosshair"></i>
            Current location
          `;

        alert(
          "Unable to get your current location. Please allow location permission.",
        );
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0,
      },
    );
  });
}

/* =====================================================
   UPDATE SELECTED LOCATION
===================================================== */

function updateSelectedLocationText(text) {
  if (selectedLocationText) {
    selectedLocationText.textContent = text;
  }
}

/* =====================================================
   OPEN MAP MODAL
===================================================== */

function openMapModal(target) {
  currentTarget = target;

  selectedLocation = null;

  if (mapModalTitle) {
    mapModalTitle.textContent =
      target === "pickup" ? "Select Pickup Location" : "Select Destination";
  }

  if (selectedLocationText) {
    selectedLocationText.textContent = "Move the map or search for a location";
  }

  if (mapSearchInput) {
    mapSearchInput.value = "";
  }

  if (!mapModal) {
    return;
  }

  mapModal.classList.add("show");

  mapModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  setTimeout(function () {
    initLeafletMap();

    if (!map) {
      return;
    }

    map.invalidateSize();

    let existingValue = "";

    if (target === "pickup" && pickupInput) {
      existingValue = pickupInput.value;
    }

    if (target === "drop" && dropInput) {
      existingValue = dropInput.value;
    }

    if (existingValue) {
      searchLocation(existingValue);
    }
  }, 250);
}

/* =====================================================
   CLOSE MAP
===================================================== */

function closeMap() {
  if (!mapModal) {
    return;
  }

  mapModal.classList.remove("show");

  mapModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

/* =====================================================
   MAP BUTTONS
===================================================== */

document.querySelectorAll(".map-select-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    const target = button.dataset.locationTarget;

    openMapModal(target);
  });
});

/* =====================================================
   CLOSE BUTTON
===================================================== */

if (closeMapModal) {
  closeMapModal.addEventListener("click", closeMap);
}

if (mapOverlay) {
  mapOverlay.addEventListener("click", closeMap);
}

/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    mapModal &&
    mapModal.classList.contains("show")
  ) {
    closeMap();
  }
});

/* =====================================================
   CONFIRM LOCATION
===================================================== */

if (confirmLocationButton) {
  confirmLocationButton.addEventListener("click", function () {
    if (!currentTarget) {
      return;
    }

    if (!selectedLocation) {
      alert("Please select a location on the map first.");

      return;
    }

    if (currentTarget === "pickup" && pickupInput) {
      pickupInput.value = selectedLocation.address;
    }

    if (currentTarget === "drop" && dropInput) {
      dropInput.value = selectedLocation.address;
    }

    updateTripSummary();

    closeMap();
  });
}
