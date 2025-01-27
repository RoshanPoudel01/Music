import { useStoreHeaderData } from "@artist/store";
import { IHeaderData } from "@artist/store/headerDataStore";
import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageHeader: FC<IHeaderData> = ({ title, description }) => {
  const location = useLocation();
  const { setHeaderData } = useStoreHeaderData();

  useEffect(() => {
    setHeaderData({
      title,
      description,
    });
  }, [location, setHeaderData, title, description]);

  return null;
};

export default PageHeader;
