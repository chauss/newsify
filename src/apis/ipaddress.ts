import axios from "axios";

const api = "https://api.ipify.org?format=json";

type IpAddress = string;

export const getPublicIpAddress = async () => {
  const result = await axios.get(api);

  return result.data.ip as IpAddress;
};
