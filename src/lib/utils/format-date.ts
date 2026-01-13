export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const time = formatTimeEnglish(date); // <-- replaced

  return `${year}/${month}/${day} ${time}`;
};

function formatTimeEnglish(date: Date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "م" : "ص";

  hours = hours % 12 || 12;
  const hh = String(hours).padStart(2, "0");

  return `${hh}:${minutes} ${ampm}`;
}
