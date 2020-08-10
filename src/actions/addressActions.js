import { FETCH_ADDRESS } from './types';

import Papa from 'papaparse';

export const fetchAddress = (csvFile) => (dispatch) => {
  let dataFromCSV;

  Papa.parse(csvFile, {
    complete: function (results) {
      dataFromCSV = results.data;
      dataFromCSV.pop(); //Remove the last empty row which Papa always adds to the array
      if (validateFileData(dataFromCSV) !== 'Validation succeed') return alert(validateFileData(dataFromCSV));
      else return dispatch({ type: FETCH_ADDRESS, payload: dataFromCSV });
    },
    header: true,
    error: function (err, file) {
      return alert('Unable to process CSV file, please verify the file and try again. ' + err.message);
    },
  });
};

const validateFileData = (file) => {
  let message;

  //check columns and headers
  let properHeaders = ['category', 'city', 'state', 'zip', 'address'];
  if (
    !(
      properHeaders.length === Object.keys(file[0]).length &&
      properHeaders.sort().every(function (value, index) {
        return value === Object.keys(file[0]).sort()[index];
      })
    )
  )
    return (message =
      'Headers in your CSV file are not the same as in the template. Please verify the file and try again.');

  //check rows
  if (file.length > 20)
    return (message = 'Your file has too many rows, the maximum amount is 20. Please verify the file and try again.');

  return (message = 'Validation succeed');
};
