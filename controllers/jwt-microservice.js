const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const publicKeyPath = path.join(__dirname, "./../keys/public.pem");
const privateKeyPath = path.join(__dirname, "./../keys/private.pem");

// key imports
const publicKEY = fs.readFileSync(publicKeyPath, "utf-8");
const privateKEY = fs.readFileSync(privateKeyPath, "utf-8");

// options
const jENV = require("./../config/tokenOptions");

module.exports = {
  verification: async function (token) {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, publicKEY, jENV.verifyOptions, function (
        err,
        decodedToken
      ) {
        if (err) {
          resolve(false);
        } else {
          resolve(decodedToken);
        }
      });
    });
  },

  signing: function (username, role, name, grade, section) {
    return jwt.sign(
      { username: username, role: role, name:name, grade:grade, section:section },
      privateKEY,
      jENV.signOptions
    );
  },


  extract: (headerfile) => {
    return new Promise(async (resolve, reject) => {
      const stringer = headerfile
      if(stringer.startsWith("Bearer ")) {
        var token = str.substring(8, str.length - 1)
        console.debug("token: ", token)
        resolve(token)
      }
      else {
        resolve(false)
      }
    })
  },

  total_verification: (headerfile) => {
    return new Promise(async (resolve, reject) => {
      // first, we will send the authorization token to the extraction function
      const extracted_token = await this.extract(headerfile)
      if(extracted_token!==false) {
        // then we send it to the verification option
        const decodedToken = await this.verification(extracted_token);
        if(decodedToken!==false) {
          resolve(decodedToken)
        }
        else {
          console.log("Extraction OK, but decoding failed")
          resolve(false)
        }
      }
      else {
        console.log("extraction failed")
        resolve(false)
      }
    })
  }
};
