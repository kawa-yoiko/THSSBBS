import axios from 'axios';

// Possible error messages:
// - Network Error
// - timeout of 3000ms exceeded
// - Request failed with status code ***

const ax = axios.create({
  baseURL: 'http://simplebbs.iterator-traits.com/api/v1/',
  timeout: 3000,
});

// Local cache for credentials and user profile

let localJWT = null;
let localUser = null;

const getLocalJWT = () => {
  if (localJWT !== null) return localJWT;
  if (localStorage.jwt) return (localJWT = localStorage.jwt);
  return null;
};
const setLocalJWT = (t) => {
  localStorage.jwt = localJWT = t;
  if (t === null) delete localStorage.jwt;
  localUser = null;   // Invalidate user profile cache
}

import EventBus from './event-bus';

// Send requests
// Returns [status, data or message]
// `status` is 0 for NetworkError and other non-HTTP errors

// `auth`: null denotes no authorization,
// undefined (omitted) denotes local JWT,
// and other values are directly used as the token

const request = (method, url, data, auth) => new Promise((resolve, _) => {
  const opts = {
    method,
    url,
    headers: auth === null ? {} : {
      'Authorization': (auth === undefined ? getLocalJWT() : auth)
    },
  };
  opts[method.toUpperCase() === 'GET' ? 'params' : 'data'] = data;
  ax(opts)
    .then((resp) => resolve([resp.status, resp.data]))
    .catch((err) => {
      if (err.response &&
          err.response.status >= 400 &&
          err.response.status < 500) {
        if (err.response.status === 401) {
          setLocalJWT(null);  // Invalidated credentials
          EventBus.emit('logged-out');
        }
        resolve([err.response.status, err.response.data.message]);
      } else {
        resolve([0, err.message]);
      }
    });
});

// Local cache for user profile

const getLocalUser = async () => {
  if (localUser !== null) return localUser;
  const jwt = getLocalJWT();
  if (jwt !== null) {
    // Try logging in
    const [status, body] = await request('GET', '/user', {});
    if (status >= 200 && status < 299) {
      return (localUser = {
        id: body.id,
        username: body.username,
        nickname: body.nickname,
        createdAt: new Date(body.created),
      });
    } else {
      // Local JWT has expired
      setLocalJWT(null);
    }
  }
  return null;
}

// Local cache for post titles

const postTitleCache = {};

const putPostTitleCached = (id, title) => postTitleCache[id] = title;
const getPostTitleCached = async (id) => {
  const c = postTitleCache[id];
  if (c !== undefined) return c;
  const [status, body] = await request('GET', `/post/${id}`);
  if (status >= 200 && status < 299) {
    postTitleCache[id] = body.title;
    return body.title;
  } else {
    return '';
  }
};

// Export

export {
  ax,
  request,
  getLocalJWT,
  setLocalJWT,
  getLocalUser,

  putPostTitleCached,
  getPostTitleCached,
};
