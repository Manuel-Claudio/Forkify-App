import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};


export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData),
    }) : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Using a race because to fail the request if user has Slow Internet
    const data = await response.json();

    if(!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
    throw error;
  };
};

/*
export const getJSON = async function(url) {
  try {
    const fetchPro = fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Using a race because to fail the request if user has Slow Internet
    const data = await response.json();

    if(!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
      throw error;
  };
    
};



// Sending Shit to the API !!!!!!!

export const sendJSON = async function(url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Using a race because to fail the request if user has Slow Internet
    const data = await response.json();

    if(!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
      throw error;
  };
    
};
*/

