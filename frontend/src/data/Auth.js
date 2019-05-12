import axios from "axios";
import {ACCESS_TOKEN, API_URL} from "./Constants";


// TODO - URL
export function getAccessToken(usernameOrEmail, password) {
  return axios.post(`${API_URL}/auth/signin`, {
    usernameOrEmail,
    password
  })
}


export function getCurrentUser() {
  let accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (!accessToken) {
    return Promise.reject("No access token set.");
  }

  /*return axios.get(API_URL + "/users/me", {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });*/

  return Promise.resolve({name: 'Admin'})
}
