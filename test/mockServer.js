// const createAxiosRequestError = require('axios/lib/core/AxiosError');

// const fourOhFour = createAxiosRequestError('🤷‍♂️', null, 404);
// const fiveOhThree = createAxiosRequestError('💥', null, 503);

const mockServer = client => stubbedResponses =>
  client.get.mockImplementation(requestUrl => {
    const match = stubbedResponses.find(([regEx]) => requestUrl.match(regEx));
    return match ? match[1]() : Promise.reject(new Error());
  });

const success = body => () => Promise.resolve(body);
const failure = body => () => Promise.reject(body);

module.exports = {
  mockServer,
  success,
  failure,
  fiveOhThree: new Error(),
};
