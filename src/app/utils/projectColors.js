"use client"
import { primaryColor, secondaryColor, accentColor, bgColor, bgAccent } from '../styles/variables.module.scss';

function setOpacity(color, opacity) {
  if (getColorType(color) === null) {
    return null;
  } else if (getColorType(color) === 'hex') {
    let [r, g, b] = hexToRgb(color);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (getColorType(color) === 'rgb') {
    let result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
    let r = parseInt(result[1]);
    let g = parseInt(result[2]);
    let b = parseInt(result[3]);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (getColorType(color) === 'rgba') {
    let result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(color);
    let r = parseInt(result[1]);
    let g = parseInt(result[2]);
    let b = parseInt(result[3]);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}

function setColor(color, colorName) {
  let r, g, b;

  // Check if color is in hex format
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    let c = color.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    r = (c >> 16) & 255;
    g = (c >> 8) & 255;
    b = c & 255;
  }
  // Check if color is in rgb format
  else if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(color)) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
    r = parseInt(result[1]);
    g = parseInt(result[2]);
    b = parseInt(result[3]);
  }
  // Check if color is in rgba format
  else if (/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.test(color)) {
    const result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(color);
    r = parseInt(result[1]);
    g = parseInt(result[2]);
    b = parseInt(result[3]);
  }
  // If color format is not recognized, return null
  else {
    return null;
  }

  // Set CSS root variables
  document.documentElement.style.setProperty(`--${colorName}-R`, r);
  document.documentElement.style.setProperty(`--${colorName}-G`, g);
  document.documentElement.style.setProperty(`--${colorName}-B`, b);
}

function lightenDarkenColor(hex, percent) {
  let [r, g, b] = hexToRgb(hex);
  r = adjustColor(r, percent);
  g = adjustColor(g, percent);
  b = adjustColor(b, percent);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function adjustColor(color, percent) {
  let newColor = color + Math.round(color * (percent / 100));
  return Math.min(Math.max(newColor, 0), 255);
}

function getContrast(hexColor){
  let [r, g, b] = hexToRgb(hexColor);
  let luminance = (0.299 * r + 0.587 * g + 0.114 * b)/255;
  return (luminance > 0.5) ? '#000000' : '#ffffff';
}

function getColorType(color) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    return 'hex';
  }
  else if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(color)) {
    return 'rgb';
  }
  else if (/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.test(color)) {
    return 'rgba';
  }
  else {
    return null;
  }
}

// get the light or dark theme setting on device
function getTheme() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Default to light theme during server-side rendering
  return 'light';
}

function defineLightDark(lightDark) {
  let [light, dark] = lightDark.trim().replace('light-dark(', '').replace(')', '').replace(' ', '').split(',');
  
  // Use a client-side check for theme
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light;
  }
  
  // Default to light theme during server-side rendering
  return light;
}

export { 
  primaryColor, 
  secondaryColor,
  accentColor, 
  bgColor, 
  bgAccent, 
  setColor, 
  lightenDarkenColor,
  hexToRgb, 
  rgbToHex, 
  adjustColor,
  getContrast,
  setOpacity,
  getColorType,
  defineLightDark,
  getTheme 
};