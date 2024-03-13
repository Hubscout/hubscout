import axios from "axios";

export async function sendEventToAmplitude(
  user_id: string,
  event_type: string,
  event_properties?: any,
) {
  const data = {
    api_key: process.env.NEXT_PUBLIC_AMPLITUDE_API,
    events: [{
      user_id: user_id,
      event_type,
      event_properties: event_properties ?? {},
    }],
  };

  const addData = await axios.post(
    "https://api2.amplitude.com/2/httpapi",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
    },
  );
}
