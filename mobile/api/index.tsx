// main api prefix
const API = 'https://min-api.cryptocompare.com';
//My own key: feel free to use but it has a limit of 100k calls a month. I strongly recommend to use your key by visiting 'https://min-api.cryptocompare.com'
const KEY = 'e4c699ea43d9e95b980d03347569fee00344b590edef5954c07327c08700cc5a';
// I have already attach the ky to the api call in the get method below.
// However, you can attach the key to the header using Authorization prop and remove it from the get method if you like.
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};
// generic fetch from 'https://min-api.cryptocompare.com api
export const get = async (uri: string): Promise<object> => {
  const response = await fetch(`${API}/${uri}&api_key=${KEY}`, {
    method: 'GET',
    headers,
  });
  return response.json();
};

export const post = async (uri: string, body: any = {}): Promise<object> => {
  const response = await fetch(`${API}/${uri}&api_key=${KEY}`, {
    method: 'POST',
    headers,
    body,
  });
  return response.json();
};
