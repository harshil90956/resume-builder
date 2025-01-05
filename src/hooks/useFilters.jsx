import { useQuery } from "react-query";

const useFilters = () => {
  const {data,isLoading,isError,refetch} = useQuery(
    "globalFilter",
    () => ({searchTerm:""}), // using a fuction to return the init data
    {refetchOnWindowFocus:false}

)
    return {data,isLoading,isError,refetch}
}

export default useFilters;