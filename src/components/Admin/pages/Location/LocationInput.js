import React from 'react';
import { GoogleComponent } from 'react-google-location';

const LocationInput = () => {
  const handlePlaceSelect = (place) => {
    const addressComponents = place.address_components;
    let city, state, country, lat, lng, postalCode;

    for (let i = 0; i < addressComponents.length; i++) {
      const component = addressComponents[i];
      const componentType = component.types[0];

      switch (componentType) {
        case 'locality':
          city = component.long_name;
          break;
        case 'administrative_area_level_1':
          state = component.short_name;
          break;
        case 'country':
          country = component.long_name;
          break;
        case 'postal_code':
          postalCode = component.short_name;
          break;
        default:
          break;
      }
    }

    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();

    console.log(city, state, country, lat, lng, postalCode);
  };

  return (
    <GoogleComponent
      apiKey={'AIzaSyAKvpQHMJ5tFlPqszuQ-cm96wBXmIefsbY'}
      language={'en'}
      country={'us'}
      types={['(regions)', 'postal_code']}
      onChange={handlePlaceSelect}
    />
  );
};

export default LocationInput;
