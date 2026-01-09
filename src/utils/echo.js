import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb", // Ask colleague: 'reverb' or 'pusher'?
  key: process.env.REACT_APP_REVERB_APP_KEY,
  wsHost: process.env.REACT_APP_REVERB_HOST,
  wsPort: process.env.REACT_APP_REVERB_PORT,
  wssPort: process.env.REACT_APP_REVERB_PORT,
  forceTLS: (process.env.REACT_APP_REVERB_SCHEME || "https") === "https",
  enabledTransports: ["ws", "wss"],
  // This part handles the Private Channel authentication
  authEndpoint: `${process.env.REACT_APP_API_BASE_URL}/api/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
});

export default echo;
