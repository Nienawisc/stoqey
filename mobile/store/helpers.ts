/**
 * generate random number of any desired digits
 * @param min minimum random number
 * @param max maximum random number
 */
export const getRandomInt = (min: number, max: number) => {
  return Math.floor(min + Math.random() * Math.floor(max));
};
/**
 * generate random dates between 2 dates.
 * @param start start date
 * @param end end date
 */
export const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
