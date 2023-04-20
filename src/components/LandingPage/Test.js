import React, { useRef, useEffect } from 'react';
import './Setting.css';

const AutocompleteInput = ({ onValueChange }) => {
  const inputRef = useRef(null);
  const [values, setValues] = React.useState({
    postalCaode: "",
    latitude: "",
    longitude: "",
    city: "",
    state: "",
    country: "",
    tz:"",
    IsAvailable: false,
  });
  useEffect(() => {
    let autocomplete;

    // Load Google Maps JavaScript API
    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKvpQHMJ5tFlPqszuQ-cm96wBXmIefsbY&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    };

    // Initialize Autocomplete
    const initAutocomplete = () => {
      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'], // Search for geographic locations
        componentRestrictions: { country: 'us' } // Restrict results to the United States
      });

      // Listen for place changed event
      autocomplete.addListener('place_changed', handlePlaceChanged);
    };

    // Handle place changed event
    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace();
      console.log(place)
      const { address_components } = place;
           let city = "";
           let state = "";
           let country = "";
           let timez="";
           let pc= "";

           address_components.forEach((component) => {
             const types = component.types;

             if (types.includes("locality")) {
               city = component.short_name;
               //timez = moment.tz(city);
             }

             if (types.includes("administrative_area_level_1")) {
               state = component.short_name;
             }

             if (types.includes("country")) {
               country = component.short_name;
             }
             if(types.includes("postal_code")){
              pc = component.short_name;
             }
           });
           setValues({
             city: city,
             state: state,
             country:country,
             latitude: place.geometry.location.lat(),
             longitude: place.geometry.location.lng(),
             tz : timez,
             postalCaode : pc
           });
           onValueChange({
            city: city,
             state: state,
             country:country,
             latitude: place.geometry.location.lat(),
             longitude: place.geometry.location.lng(),
             tz : timez,
             postalCaode : pc
           })
        if (place.geometry && place.geometry.location) {
          //console.log(place.geometry.location)
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          // console.log(latitude)
          // console.log(longitude)
          // Fetch timezone using latitude and longitude
          // fetchTimezone(latitude, longitude)
          //   .then(timezone => {
          //     // Do something with the timezone
          //     console.log('Timezone:', timezone);
          //   })
          //   .catch(error => {
          //     console.error('Failed to fetch timezone:', error);
          //   });
        }
    };
    

    // Fetch timezone using latitude and longitude
    // const fetchTimezone = (latitude, longitude) => {
    //   const timestamp = Math.floor(Date.now() / 1000);
    //   return fetch(
    //     `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=YOUR_API_KEY`
    //   )
    //     .then(response => response.json())
    //     .then(data => {
    //       if (data && data.status === 'OK') {
    //         return data.timeZoneId;
    //       } else {
    //         throw new Error('Failed to fetch timezone');
    //       }
    //     });
    // };

    // Load Google Maps JavaScript API and initialize Autocomplete on component mount
    loadGoogleMapsAPI();

    // Clean up on component unmount
    // return () => {
    //   if (autocomplete) {
    //     autocomplete.removeListener('place_changed', handlePlaceChanged);
    //   }
    // };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      className='inputString'
      placeholder="Please enter city or pincode"
    />
  );
};

export default AutocompleteInput;
