import * as Updates from "expo-updates";

let backendUrl = "http://localhost:5000";

if (Updates.manifest?.extra?.expoGo?.debuggerHost) {
  const ip = Updates.manifest.extra.expoGo.debuggerHost.split(":").shift();
  backendUrl = `http://${ip}:5000`;
}

export const API_BASE_URL = backendUrl;
  