import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);
  const [clothingType, setClothingType] = useState([]);
  const [clothCategory, setClothCategory] = useState([]);
  const [prefCategory, setPrefCategory] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/clothCatAPI/getClothCategory")
      .then((res) => res.json())
      .then((data) => {
        setClothCategory(data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:4000/clothAPI/getClothing")
      .then((res) => res.json())
      .then((data) => {
        setClothingType(data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:4000/recommendAPI/getRecommends")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  const fetchRecord = () => {
    fetch("http://localhost:4000/recommendAPI/getRecommends")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };
  useEffect(() => {
    fetchRecord();
  }, []);
  useEffect(() => {
    fetch("http://localhost:4000/prefAPI/getPreference")
      .then((res) => res.json())
      .then((data) => {
        setPrefCategory(data);
      });
  }, []);
  const formatData = data?.map((item) => {
    const clothing = clothingType.find(
      (c) => c.clothing_id === item?.clothing_id
    );
    const category = clothCategory.find(
      (c) => c.clothing_category_id === item?.clothing_category_id
    );
    const prefCat = prefCategory.find(
      (c) => c.preference_id === item?.preference_id
    );
    return {
      id: item?.recommended_id,
      clothingType: clothing ? clothing?.clothing_type : "",
      appTemp_Start: item?.apparent_temp_range_start,
      appTemp_End: item?.apparent_temp_range_end,
      clothinCategory: category ? category?.category_name : "",
      prefCat:prefCat? prefCat.preference :''
    };
  });

  // preference_id

  return (
    <Card>
    
          <DataTable
            tableData={formatData}
            clothCategoryData={clothCategory}
            clothingTypeData={clothingType}
            prefCategory={prefCategory}
            fetchRecord={fetchRecord}
          />
  
    </Card>
  );
}

export default TableData;
