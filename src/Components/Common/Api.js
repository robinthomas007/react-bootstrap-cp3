import axios from "axios";
import { BASE_URL } from "./../../App";
import getCookie from "./cookie";

export const getPolicy = () => {
  return axios
    .get(BASE_URL + "BlockPolicy/GetBlockPolicy", {
      headers: {
        cp3_auth: getCookie("cp3_auth"),
      },
    })
}