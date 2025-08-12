// config.js
import Constants from "expo-constants";

const localhost = "http://localhost:5000"; // For browser-based development
let backendUrl = localhost;

if (Constants.manifest?.debuggerHost) {
  // Extract the LAN IP from Expo's debugger host
  const ip = Constants.manifest.debuggerHost.split(":").shift();
  backendUrl = `http://${ip}:5000`; // Change 5000 to your backend port
}

export const API_BASE_URL = backendUrl;
