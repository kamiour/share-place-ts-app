import axios from "axios";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.querySelector("#address")! as HTMLInputElement;

const GOOGLE_API_KEY = "GOOGLE_API_KEY_VALUE"; // TODO: remove when uploading to github, remove from index.html, too, update README

// declare var google: any; //not required since we installed @types/googlemaps for typescript support

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }

      const coordinates = response.data.results[0].geometry.location;

      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 16,
      }); // instantiating a Google map

      new google.maps.Marker({
        position: coordinates,
        map: map,
      }); // adding a marker to the map
    })
    .catch((err) => {
      alert(err);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
