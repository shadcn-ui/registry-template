export const formatLargeNumber = (num?: number): string => {
  if (!num) return "0";

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 2000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};
