import { Table } from "antd";
import { weekDays } from "../constant";

export default function CourseTimetable({ children }) {
  const timetable = {};

  children?.forEach((item) => {
    const [date, time] = item.split(" ");
    timetable[date] = time;
  });

  const column = weekDays.map((item) => {
    return {
      key: item,
      title: item,
      dataIndex: item,
      align: "center",
      render: () => timetable[item],
    };
  });

  const data = [{ id: "0" }];

  return (
    <Table
      rowKey="id"
      columns={column}
      dataSource={data}
      bordered
      pagination={false}
    />
  );
}
