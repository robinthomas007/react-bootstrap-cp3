import getCookie from "./cookie";
import jwt_decode from "jwt-decode";

export const getUsername = () => {
  try {
    const token = getCookie("cp3_auth");
    let user = jwt_decode(token);
    return user.name;
  } catch (err) {
    console.log("Error getting Token", err);
  }
};


export const config = {
  headers: {
    cp3_auth: getCookie("cp3_auth"),
  },
};