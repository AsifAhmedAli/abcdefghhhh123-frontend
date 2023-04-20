import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/prefAPI/getPreference")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  const formatData = data?.map((item) => ({
    id: item?.preference_id,
    prefCatType: item?.preference_category,
    preference: item?.preference,
  }));

  return (
    <Card>
      {formatData?.length > 0 && <DataTable tableData={formatData} />}
    </Card>
  );
}

export default TableData;
