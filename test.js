/** @format */

let name = "priti";
let email = "priti@gmail.com";
let phone;
let bio;
let username;
const allowField = { name, username, email, phone, bio };

const updatedUser = Object.keys(allowField).reduce((acc, key) => {
  if (allowField[key] !== undefined && allowField[key] !== null) {
    acc[key] = allowField[key];
    // console.log("acc---> ", acc);
    // console.log("acc[key]---> ", acc[key]);
    // console.log("allow[key]---> ", allowField[key]);
    // console.log("[key]---> ", key);
  }
  return acc;
}, {});
console.log(updatedUser);

// 2
const updatedData = {};
if (name) updatedData.name = name;
if (email) updatedData.email = email;
if (username) updatedData.username;
if (bio) updatedData.bio = bio;
if (phone) updatedData.phone = phone;
console.log(updatedData);
