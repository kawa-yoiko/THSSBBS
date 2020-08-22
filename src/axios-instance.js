import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://simplebbs.iterator-traits.com/api/v1/',
  timeout: 3000,
});

export default instance;
