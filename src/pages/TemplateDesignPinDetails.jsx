import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import { getTemplateDetails, saveToCollection, saveToFavourites } from '../api';
import { FaHouse } from 'react-icons/fa6';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import useTemplate from '../hooks/useTemplate';
import { AnimatePresence } from 'framer-motion'
import { TemplateDesignPin } from '../components';
const TemplateDesignPinDetails = () => {

    const {templateID} = useParams();
    const { data:templates,refetch:temp_Refetch } = useTemplate();
    const {data,isError,isLoading,refetch} = useQuery(
      [
        "template",templateID
      ],
      ()=>getTemplateDetails(templateID)
    )
    const {data:user,refetch:userRefecth} = useUser();
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        setIsFavourite(data?.favourites?.includes(user?.uid));
    }, [data, user]);

    const addToCollection = async (e) => { 
        e.stopPropagation();
        await saveToCollection(user, data);
        userRefecth();
    };

    const addToFavourites = async (e) => {  
        e.stopPropagation();
        await saveToFavourites(user, data);
        userRefecth();
        temp_Refetch();
        setIsFavourite(!isFavourite); // Toggle the favourite state
    };

    if(isLoading){
      return <p>Loading...</p>
    }

    if (isError) {
      return (
        <React.Fragment>
          <p className='text-lg text-txtPrimary'>Error Fetching Template</p>
          <button onClick={refetch}>Retry</button>
        </React.Fragment>)
      
    }
    return (
    <div className='w-full flex items-center justify-start flex-col px-4 py-12'>
       {/* bread crump */}
       <div className='w-full flex items-center pb-8 gap-2'>
        <Link to={"/"} className='flex items-center justify-center gap-2 text-txtPrimary'>
          <FaHouse/>Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
       </div>

     {/* main section layout */}
     <div className='w-full grid grid-cols-1 lg:grid-cols-12 '>
      {/* left section */}
      <div className='col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
      {/* load the template img */}
      <img src={data?.imageURL} className='w-full h-auto object-contain rounded-md '/>

      {/* title and other option */}
      <div className='w-full flex flex-col items-start justify-start gap-2'>
         {/* title section */}
         <div className='w-full flex items-center justify-between '>
          {/* title */}
         <p className='text-base text-txtPrimary font-semibold'>{data?.title}</p>
         {/* likes */}
         {
          data?.favourites?.length > 0 && (
            <div className='flex items-center justify-center gap-1'>
            <BiSolidHeart className='text-base text-red-500'/>
             <p className='text-base text-txtPrimary font-semibold'>{data?.favourites?.length} likes</p>
            </div>
          )
         }
       
         </div>


      {/* Collections and Favourites Option */}
{
  user && (
    <div className='flex items-center justify-start gap-3'>
      {/* Collection Button */}
      <div onClick={addToCollection} className='flex items-center justify-center rounded-md px-4 py-2 border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
        {user?.collection?.includes(data?._id) ? (
          <>
            <BiSolidFolderPlus className='text-base text-txtPrimary '/>
            <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove From Collection</p>
          </>
        ) : (
          <>
            <BiFolderPlus className='text-base text-txtPrimary '/>
            <p className='text-sm text-txtPrimary whitespace-nowrap'>Add To Collection</p>
          </>
        )}
      </div>

      {/* Favourite Button */}
      <div onClick={addToFavourites} className='flex items-center justify-center rounded-md px-4 py-2 border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
        {isFavourite ? (
          <>
            <BiSolidHeart className='text-base text-red-500 '/>
            <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove From Favourites</p>
          </>
        ) : (
          <>
            <BiHeart className='text-base text-txtPrimary '/>
            <p className='text-sm text-txtPrimary whitespace-nowrap'>Add To Favourites</p>
          </>
        )}
      </div>
    </div>
  )
}

     
      </div>
      </div>
      {/* right section */}
      <div className='col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start gap-6 px-3'>
            <div className='w-full h-72 bg-blue-200 rounded-md overflow-hidden relative ' style={{background:"url(https://cdn.pixabay.com/photo/2023/10/04/03/04/ai-generated-8292699_1280.jpg)",backgroundPosition:"center",backgroundSize:"cover"} }>
           <div className='absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]'>
            <Link to={"/"} className='px-4 py-2 rounded-md border-2 border-gray-50 text-white'>
               Discover More
            </Link>
            {/* discover section */}
           </div>
          </div>
          {/* edit the template */}
          {
            user && (
              <Link to={`/resume/${data?.name}?templateId=${templateID}`} className='w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-500'>
                <p className=' font-semibold text-white text-lg'>Edit This Template</p>
              </Link>
            )
          }

      {/* tags */}
     <div className='w-full flex items-center justify-start flex-wrap gap-3'>
        {
          data?.tags?.map((tag,index) =>(
            <p className='text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap gap-2' key={index}>{tag}</p>
          ))
        }
     </div>
      </div>
     </div>

     
{/* similler templates */}
{
 templates?.filter((temp) =>temp._id !==data?._id)?.length > 0 && (
<div className='w-full py-8 flex flex-col items-start justify-start gap-4'>
            <p className='text-lg font-semibold text-txtdark'>You Might Also Like This</p>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'> 
            <React.Fragment>
      <AnimatePresence>
        {templates
        ?.filter((temp) =>temp._id !==data?._id)
        .map((template,index) => (
          <TemplateDesignPin key={template?._id} data={template} index={index}/>
        ))}
      </AnimatePresence>
      </React.Fragment>
            </div>
         </div>
  ) 
}



    </div>
  )
}

export default TemplateDesignPinDetails