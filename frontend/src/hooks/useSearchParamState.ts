import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface UseSearchParamsState {
  pageParam?: string;
  queryParam?: string;
  statusParam?: string;
}

export const useSearchParamsState = ({
  pageParam = "page",
  queryParam = "q",
  statusParam = "status",
}: UseSearchParamsState = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);

  // Get initial values from URL or set defaults
  const pageFromUrl = urlParams.get(pageParam) || "1";
  const queryFromUrl = urlParams.get(queryParam) || "";
  const statusFromUrl = urlParams.get(statusParam) || "";
  const [pageIndex, setPageIndex] = useState<number>(parseInt(pageFromUrl));
  const [keyword, setKeyword] = useState<string>(queryFromUrl);
  const [status, setStatus] = useState<string>(statusFromUrl);

  // Sync pageIndex state with URL changes
  useEffect(() => {
    setPageIndex(parseInt(pageFromUrl));
  }, [pageFromUrl]);

  // Sync keyword state with URL changes and update the URL on keyword change
  useEffect(() => {
    if (keyword) {
      urlParams.set(queryParam, keyword);
    } else {
      urlParams.delete(queryParam);
    }
    navigate({ search: urlParams.toString() }, { replace: true });
  }, [keyword, pageIndex, navigate, queryParam]);

  useEffect(() => {
    if (status) {
      urlParams.set(statusParam, status);
    } else {
      urlParams.delete(statusParam);
    }
    navigate({ search: urlParams.toString() }, { replace: true });
  }, [status, pageIndex, navigate, statusParam]);

  // Sync pageIndex state with URL changes and update the URL on pageIndex change
  useEffect(() => {
    if (parseInt(pageFromUrl) !== 1) {
      urlParams.set(pageParam, pageIndex.toString());
    }
    if (status) {
      urlParams.set(statusParam, status);
    }
    if (keyword) {
      urlParams.set(queryParam, keyword);
    }
    navigate({ search: urlParams.toString() }, { replace: true });
  }, [
    pageIndex,
    navigate,
    pageParam,
    status,
    statusParam,
    keyword,
    queryParam,
  ]);

  return { pageIndex, setPageIndex, keyword, setKeyword, status, setStatus };
};
