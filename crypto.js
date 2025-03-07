const crypto = require("crypto-js");
const env = require("dotenv");

env.config();

const my_password = "demo";
//const my_key = "catwoldall";
const my_key = process.env.SECRET_KEY;

//encode
const password = crypto.AES.encrypt(my_password, my_key);
console.log('password ', password.toString());

//decode
const data = crypto.AES.decrypt(password.toString(), my_key);
console.log('password ', data.toString(crypto.enc.Utf8));