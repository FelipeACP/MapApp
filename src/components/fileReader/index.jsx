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
    let fileName = this.state.csvFile.name;
    if (fileName.substring(fileName.length - 4, fileName.length) === '.csv')
      this.props.fetchAddress(this.state.csvFile);
    else return alert('The type of your file is not CSV. Please try again with another file.');
  };

  render() {
    return (
      <div className="importDiv">
        <h3>Import your CSV File</h3>
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
        {this.state.csvFile !== undefined && (
          <button className="uploadButton" onClick={this.importCSV}>
            Upload now!
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  addresses: state.addresses.addressesInfo,
});

export default connect(mapStateToProps, { fetchAddress })(FileReader);
