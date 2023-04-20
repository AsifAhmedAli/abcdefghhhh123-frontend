import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);
  const [clothCategory, setClothCategory] = useState([]);

  const fetchRecord = () => {
    fetch("http://localhost:4000/clothAPI/getClothing")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };
  useEffect(() => {
    fetchRecord();
  }, []);
  useEffect(() => {
    fetch("http://localhost:4000/clothCatAPI/getClothCategory")
      .then((res) => res.json())
      .then((data) => {
        setClothCategory(data);
      });
  }, []);
  const formatData = data?.map((item) => {
    const category = clothCategory.find(
      (c) => c.clothing_category_id === item?.clothing_category_id
    );
    return {
      id: item?.clothing_id,
      categoryName: category ? category.category_name : "",
      clothingName: item?.clothing_type,
      image: item?.clothing_image_path,
    };
  });

  return (
    <Card>
      {formatData?.length > 0 && (
        <DataTable clothCategory={clothCategory} tableData={formatData} fetchRecord={fetchRecord}/>
      )}
    </Card>
  );
}

export default TableData;
