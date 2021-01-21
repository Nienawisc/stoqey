export const localeAmount = (num: number): string => {
  return `${num}`.toLocaleLowerCase();
};

export function numberCommas(x: number): string {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getPlus(num: number): string {
  return num > 0 ? `+${num}` : `${num}`;
}

export const getLastChar = (item: string, count?: number): string => {
  return item && item.substr(item.length - (count || 5)); // => "Tabs1"
};

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
