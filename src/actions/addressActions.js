import { FETCH_ADDRESS } from './types';

import Papa from 'papaparse';

export const fetchAddress = (csvFile) => (dispatch) => {
  let dataFromCSV;

  Papa.parse(csvFile, {
    complete: function (results) {
      dataFromCSV = results.data;
      dataFromCSV.pop(); //Remove the last empty row which Papa always adds to the array
      if (dataFromCSV.length > 20) return alert('Your file has too many rows. Please verify the file and try again.');
      return dispatch({ type: FETCH_ADDRESS, payload: dataFromCSV });
    },
    header: true,
    error: function (err, file) {
      return alert(
        'Unable to process CSV file, please verify the file and try again. Error reason was: ' + err.message,
      );
    },
  });
};
