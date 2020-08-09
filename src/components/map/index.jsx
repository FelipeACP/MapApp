import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

//marker colors for categories
const colors = [
  'https://i.imgur.com/NsQQAix.png', 'https://i.imgur.com/5cB7OUv.png', 'https://i.imgur.com/iBtUyCa.png',  'https://i.imgur.com/FwyXica.png', 'https://i.imgur.com/3bXECRM.png', 'https://i.imgur.com/6IF42VT.png', 'https://i.imgur.com/2qYxhkf.png', 'https://i.imgur.com/9JRtUiL.png', 'https://i.imgur.com/6e50x9Y.png', 'https://i.imgur.com/zTW0MaD.png', 'https://i.imgur.com/2xiKuH6.png', 'https://i.imgur.com/nltkFOq.png', 'https://i.imgur.com/cUGYRvC.png', 'https://i.imgur.com/ipbn3SR.png', 'https://i.imgur.com/KVUb4l7.png', 'https://i.imgur.com/ABY52gh.png', 'https://i.imgur.com/auR5Z0M.png', 'https://i.imgur.com/8q3VqKE.png', 'https://i.imgur.com/gLTEbzv.png', 'https://i.imgur.com/Ll1k7wz.png',
];

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

  getLatLong = () => {
    const addresses = this.props.addresses;
    const coordinates = [];
    const geocoder = new this.props.google.maps.Geocoder();
    for (let i = 0; i < addresses.length; i++) {
      let address = `${addresses[i].state ? addresses[i].state + ' ' : ''}${addresses[i].city ? addresses[i].city + ' ' : ''}${addresses[i].zip ? addresses[i].zip + ' ' : ''}${addresses[i].address ? addresses[i].address : ''}`;
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          let locationString = `${results[0].geometry.location}`;
          let lat = Number(locationString.substring(1, locationString.indexOf(',')));
          let lng = Number(locationString.substring(locationString.indexOf(',') + 2, locationString.length - 1));
          let newLoc = { lat: lat, lng: lng, category: addresses[i].category, address: address };
          coordinates.push(newLoc);
          if (i + 1 === addresses.length && coordinates !== this.state.coordinates) {
            this.setState({ coordinates: coordinates });
          }
        } else {
          this.setState({ addressError: 'One or more of your addresses were invalid.' });
        }
      });
    }
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
      <>
        {this.state.addressError !== undefined && <div>{this.state.addressError}</div>}
        <Map
          google={this.props.google}
          zoom={8}
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
              <h1>{this.state.markerCat}</h1>
              <h3>{this.state.markerAddress}</h3>
            </div>
          </InfoWindow>
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

// eslint-disable-next-line no-extend-native
Array.prototype.groupDynamically = function (prop) {
  return this.reduce(function (groups, item) {
    var val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};
