import { useQuery } from "react-query"
import { toast } from "react-toastify"
import { getUserDetails } from "../api";

const useUser = () =>{
    const {data,isLoading,isError,refetch} = useQuery(
        "user",
        async () =>{
            try {
                const userDetails = await getUserDetails();
                console.log("UserDetails",userDetails);
                
                return userDetails;
            } catch (error) {
                console.log(error);
                
                if(!error.message.includes("not authenticated")){
                    toast.error("Something went wrong...");
                }

            }
        },
        {refetchOnWindowFocus:false}
    );
    return {data,isLoading,isError,refetch}
}

export default useUser;