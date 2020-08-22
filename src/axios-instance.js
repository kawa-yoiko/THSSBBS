import axios from 'axios';

// Possible error messages:
// - Network Error
// - timeout of 3000ms exceeded
// - Request failed with status code ***

const ax = axios.create({
  baseURL: 'http://simplebbs.iterator-traits.com/api/v1/',
  timeout: 3000,
});

// Local cache for credentials

let localJWT = null;

const getLocalJWT = () => {
  if (localJWT !== null) return localJWT;
  if (localStorage.jwt !== null) return (localJWT = localStorage.jwt);
  return null;
};
const setLocalJWT = (t) => {
  localStorage.jwt = localJWT = t;
}

// Send requests
// Returns [status, data or message]
// `status` is 0 for NetworkError and other non-HTTP errors

const request = (method, url, data, auth, fin) => new Promise((resolve, _) => {
  ax({
    method,
    url,
    data,
    headers: !auth ? {} : {
      'Authorization': getLocalJWT()
    },
  }).then((resp) => resolve([resp.status, resp.data]))
    .catch((err) => {
      if (err.response !== null &&
          err.response.status >= 400 &&
          err.response.status < 500) {
        resolve([err.response.status, err.response.data.message]);
      } else {
        resolve([0, err.message]);
      }
    })
    .finally(fin);
});

// Local cache for user profile

let localUser = null;

const getLocalUser = async () => {
  if (localUser !== null) return localUser;
  const jwt = getLocalJWT();
  if (jwt !== null) {
    // Try logging in
    const [status, data] = await request('GET', '/user', {}, true);
    if (status >= 200 && status < 299) {
      return (localUser = data);
    }
  }
  return null;
}

// Export

export {
  ax,
  request,
  getLocalJWT,
  setLocalJWT,
  getLocalUser,
};
