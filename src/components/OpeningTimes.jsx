import Paragraph from "./Paragraph";

const openingHoursData = [
  { id: 1, day: "Monday", openingHours: "8:00-22:00" },
  { id: 2, day: "Tuesday", openingHours: "8:00-22:00" },
  { id: 3, day: "Wednesday", openingHours: "8:00-22:00" },
  { id: 4, day: "Thursday", openingHours: "8:00-22:00" },
  { id: 5, day: "Friday", openingHours: "8:00-22:00" },
  { id: 6, day: "Saturday", openingHours: "8:00-21:00" },
  { id: 7, day: "Sunday", openingHours: "8:00-18:00" },
  { id: 8, day: "Bank Holidays", openingHours: "Closed" },
];

const columns = [
  { header: "Day", accessor: "day" },
  { header: "Opening Hours", accessor: "openingHours" },
];

function OpeningTimes() {
  return (
    <section className="w-full border border-black/35 rounded-lg p-6 flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Opening Times
      </h2>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #ddd",
        }}
      />

      <table className="w-full border-collapse border border-gray-300 font-p-text">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                scope="col"
                className="border border-gray-300 p-2 text-left"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {openingHoursData.map((day) => (
            <tr key={day.id}>
              {columns.map((column) => (
                <td
                  key={`${day.id}-${column.accessor}`}
                  style={{ border: "1px solid #ddd", padding: "8px" }}
                >
                  {day[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default OpeningTimes;
