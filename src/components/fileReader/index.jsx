import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchAddress } from '../../actions/addressActions';

class FileReader extends Component {
  constructor() {
    super();
    this.state = { csvFile: undefined };
  }

  handleChange = (e) => {
    this.setState({
      csvFile: e.target.files[0],
    });
  };

  importCSV = () => {
    if (this.state.csvFile.type === 'application/vnd.ms-excel') this.props.fetchAddress(this.state.csvFile);
    else return alert('The type of your file is not CSV. Please try again.');
  };

  render() {
    return (
      <div className="App">
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={(input) => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        {this.state.csvFile !== undefined && <button onClick={this.importCSV}> Upload now!</button>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  addresses: state.addresses.addressesInfo,
});

export default connect(mapStateToProps, { fetchAddress })(FileReader);
