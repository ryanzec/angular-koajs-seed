window.onerror = function (errorMsg, url, lineNumber, columnNumber, errorObject) {
  var errMsg;

  //check the errorObject as IE and FF don't pass it through (yet)
  if (errorObject && errorObject !== undefined) {
    errMsg = errorObject.message;
  } else {
    errMsg = errorMsg;
  }

  console.log('Error: ' + errMsg);
};
