export const errorHandler = (myStatusCode, myErrorMessage) => {
  const error = new Error();
  error.statusCode = myStatusCode;
  error.message = myErrorMessage;
  return error;
};
