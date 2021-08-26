import axios from 'axios';
import { TOKEN_ID } from "./constants"

const fetcher = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  headers: {
    authorization: `Bearer ${localStorage.getItem(TOKEN_ID)}`,
  },
});

export const get = async (url) => {
  try {
    const raw = await fetcher.get(url);
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const post = async (url, data, params) => {
  try {
    const raw = await fetcher.post(url, data, { params });
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const put = async (url, data, params) => {
  try {
    const raw = await fetcher.put(url, data, { params });
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const patch = async (url, data, params) => {
  try {
    const raw = await fetcher.patch(url, data, { params });
    return raw.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCall = async (url) => {
  try {
    const raw = await fetcher.delete(url);
    return raw.data;
  } catch (err) {
    throw err;
  }
};
