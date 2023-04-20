import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);

  const fetchRecord = () => {
    fetch("http://localhost:4000/clothCatAPI/getClothCategory")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };
  useEffect(() => {
    fetchRecord();
  }, []);
  const formatData = data.map((item) => ({
    id: item?.clothing_category_id,
    categoryName: item?.category_name,
  }));

  return (
    <Card>
      {formatData?.length > 0 && <DataTable tableData={formatData} fetchRecord={fetchRecord}/>}
    </Card>
  );
}

export default TableData;
