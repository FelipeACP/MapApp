import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class GoogleMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
    };
  }

  componentDidUpdate() {
    this.getLatLong();
  }

  getLatLong = () => {
    const addresses = this.props.addresses;
    const coordinates = [];
    const geocoder = new this.props.google.maps.Geocoder();
    for (let i = 0; i < addresses.length; i++) {
      let address = `${addresses[i].state}, ${addresses[i].city}, ${addresses[i].zip}, ${addresses[i].address}`;
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          let locationString = `${results[0].geometry.location}`;
          let lat = Number(locationString.substring(1, locationString.indexOf(',')));
          let lng = Number(locationString.substring(locationString.indexOf(',') + 2, locationString.length - 1));
          let newLoc = { lat: lat, lng: lng };
          coordinates.push(newLoc);
          console.log(coordinates);
          if (i + 1 === addresses.length && coordinates !== this.state.coordinates) {
            this.setState({ coordinates: coordinates });
          }
        } else {
          alert('One or more of your addresses were invalid.');
        }
      });
    }
  };

  displayMarkers = () => {
    console.log('markers are running');
    return this.state.coordinates.map((address, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: address.lat,
            lng: address.lng,
          }}
          onClick={() => console.log('You clicked me!')}
        />
      );
    });
  };

  setMapBounds = () => {
    let bounds = new this.props.google.maps.LatLngBounds();
    for (let i = 0; i < this.state.coordinates.length; i++) {
      bounds.extend(this.state.coordinates[i]);
    }
    return bounds;
  };

  render() {
    return (
      <>
        <Map
          google={this.props.google}
          zoom={8}
          initialCenter={{ lat: 47.444, lng: -122.176 }}
          bounds={this.setMapBounds()}
        >
          {this.state.coordinates.length > 0 && this.displayMarkers()}
        </Map>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  addresses: state.addresses.addressesInfo,
});

export default connect(mapStateToProps)(
  GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  })(GoogleMap),
);
