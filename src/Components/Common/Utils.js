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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export const ADMIN = '4d460fe7-b447-454c-bb0d-7f60797a74a0'
export const USER = '7ac0853c-8182-42cc-b034-9e4804144f75'
