import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const colors = ['https://i.imgur.com/NsQQAix.png', 'https://i.imgur.com/5cB7OUv.png', 'https://i.imgur.com/iBtUyCa.png', 'https://i.imgur.com/FwyXica.png', 'https://i.imgur.com/3bXECRM.png', 'https://i.imgur.com/6IF42VT.png', 'https://i.imgur.com/2qYxhkf.png', 'https://i.imgur.com/9JRtUiL.png', 'https://i.imgur.com/6e50x9Y.png', 'https://i.imgur.com/zTW0MaD.png', 'https://i.imgur.com/2xiKuH6.png', 'https://i.imgur.com/nltkFOq.png', 'https://i.imgur.com/cUGYRvC.png', 'https://i.imgur.com/ipbn3SR.png', 'https://i.imgur.com/KVUb4l7.png', 'https://i.imgur.com/ABY52gh.png', 'https://i.imgur.com/auR5Z0M.png', 'https://i.imgur.com/8q3VqKE.png', 'https://i.imgur.com/gLTEbzv.png', 'https://i.imgur.com/Ll1k7wz.png'] //markers colors for categories


class GoogleMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.addresses !== prevProps.addresses)
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
          let newLoc = { lat: lat, lng: lng, category: addresses[i].category };
          coordinates.push(newLoc);
          console.log(coordinates); //this keeps logging in the console
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
    console.log('markers are running'); //this keeps logging in the console too
    let locationsWithCategories = this.state.coordinates.groupDynamically('category');
    return Object.keys(locationsWithCategories).map((key, index) => {
        return locationsWithCategories[key].map(({ category , ...obj}) => {
            return (
                <Marker
                  key={index}
                  id={index}
                  position={obj}
                  icon={colors[index]}
                  onClick={() => console.log('You clicked me!')}
                />
              );
            
        })
    })
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
          initialCenter={{ lat: 47.444, lng: -122.176 }} //Those initials will be current user location later
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

//I've got this code from stack overflow, works nice but I'm not sure if it's the best solution
// eslint-disable-next-line no-extend-native
Array.prototype.groupDynamically = function(prop) {
    return this.reduce(function(groups, item) {
      var val = item[prop];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }