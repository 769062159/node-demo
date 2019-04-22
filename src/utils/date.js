import moment from "moment";

export function toYear(timestamp) {
  return moment(timestamp).format('YYYY');
}

export function toDate(timestamp) {
  return moment(timestamp).format('YYYY-MM-DD');
}

export function toDateTime(timestamp) {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

export function toTime(timestamp) {
  return moment(timestamp).format('HH:mm:ss');
}

export function toMoment(timestamp) {
  return moment(timestamp);
}
