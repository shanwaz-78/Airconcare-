export const formatDate = (dateString: Date) => {
  try {
    return new Intl.DateTimeFormat("en-US").format(new Date(dateString));
  } catch {
    return "-";
  }
};
