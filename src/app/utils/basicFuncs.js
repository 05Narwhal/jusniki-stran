"use client"
export const isMobileDevice = () => {
  let userAgent 
  if (typeof window !== 'undefined') {
    userAgent = navigator.userAgent || navigator.vendor || window.opera;

    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  }
  
  return false;
}

export function getFormattedDateTime() {
  const now = new Date();

  // Extract date components
  const day = String(now.getDate()).padStart(2, '0'); // Ensure 2 digits
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = now.getFullYear();

  // Extract time components
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format the string
  return `${day}/${month}/${year}-${hours}:${minutes}:${seconds}`;
}

export function deepCopy(input) {
  if (Array.isArray(input)) {
    // Deep copy each element of the array
    return input.map(item => deepCopy(item));
  } else if (input && typeof input === 'object') {
    // Deep copy each key-value pair in the object
    const copy = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        copy[key] = deepCopy(input[key]);
      }
    }
    return copy;
  }
  // Primitive values (number, string, etc.) are returned as-is
  return input;
}

export function sum(list) {
  let count = 0
  for (let item of list) {
    count += parseInt(item)
  }
  return count
}