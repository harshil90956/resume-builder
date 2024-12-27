import { useQuery } from "react-query"
import { toast } from "react-toastify";
import { getTemplates } from "../api";

const useTemplate = () =>{
    const {data ,isLoading,refetch,isError} = useQuery(
        "templates",
        async ()=>{
            try {
                const templates = await getTemplates();
                console.log("Templates",templates);
                return templates;
            } catch (err) {
                console.log(err);
                toast.error("Something went wrong...");
            }
        },
        {refetchOnWindowFocus:false}
    );
    return {data,isLoading,isError,refetch}
}

export default useTemplate;