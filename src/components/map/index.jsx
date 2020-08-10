import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { colors } from '../../utils/markerColors';

const style = {
  width: '80%',
  height: '70%',
  margin: '2vh 10vw',
};

class GoogleMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
      addressError: '',
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
      markerAddress: '',
      markerCat: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.addresses !== prevProps.addresses) this.getLatLong();
  }

  geocode = (address) =>
    new Promise((resolve, reject) => {
      const geocoder = new this.props.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          let locationString = `${results[0].geometry.location}`;
          let lat = Number(locationString.substring(1, locationString.indexOf(',')));
          let lng = Number(locationString.substring(locationString.indexOf(',') + 2, locationString.length - 1));
          let newLoc = { lat: lat, lng: lng, address: address };
          resolve(newLoc);
        } else {
          reject('One or more of your addresses were invalid.');
        }
      });
    });

  getLatLong = async () => {
    const addresses = this.props.addresses;
    const coordinates = [];
    for (let i = 0; i < addresses.length; i++) {
      let address = `${addresses[i].state ? addresses[i].state + ' ' : ''}${
        addresses[i].city ? addresses[i].city + ' ' : ''
      }${addresses[i].zip ? addresses[i].zip + ' ' : ''}${addresses[i].address ? addresses[i].address : ''}`;
      try {
        let newLoc = await this.geocode(address);
        coordinates.push({ ...newLoc, category: addresses[i].category });
      } catch (addressError) {
        this.setState({ addressError });
        console.error(addressError);
      }
    }
    this.setState({ coordinates });
  };

  displayMarkers = () => {
    let locationsWithCategories = this.state.coordinates.groupDynamically('category');
    return Object.keys(locationsWithCategories).map((key, index) => {
      return locationsWithCategories[key].map(({ category, address, ...obj }) => {
        return (
          <Marker
            key={address}
            id={address}
            className={category}
            position={obj}
            icon={colors[index]}
            onClick={this.onMarkerClick}
          />
        );
      });
    });
  };

  setMapBounds = () => {
    let bounds = new this.props.google.maps.LatLngBounds();
    for (let i = 0; i < this.state.coordinates.length; i++) {
      bounds.extend(this.state.coordinates[i]);
    }
    return bounds;
  };

  onMarkerClick = (props, marker) =>
    this.setState({
      activeMarker: marker,
      selectedPlace: marker.position,
      showingInfoWindow: true,
      markerAddress: marker.id,
      markerCat: marker.className,
    });

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false,
      });
  };

  render() {
    return (
      <div className="mapDiv">
        {this.state.addressError !== undefined && <div className="errorDiv">{this.state.addressError}</div>}
        <Map
          google={this.props.google}
          style={style}
          zoom={7}
          onClick={this.onMapClicked}
          initialCenter={{ lat: 51.107883, lng: 17.038538 }}
          bounds={this.setMapBounds()}
        >
          {this.state.coordinates.length > 0 && this.displayMarkers()}
          <InfoWindow
            marker={this.state.activeMarker}
            onClose={this.onInfoWindowClose}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h4>{this.state.markerCat}</h4>
              <h5>{this.state.markerAddress}</h5>
            </div>
          </InfoWindow>
        </Map>
      </div>
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

// eslint-disable-next-line no-extend-native
Array.prototype.groupDynamically = function (prop) {
  return this.reduce(function (groups, item) {
    var val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};
