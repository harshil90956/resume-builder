import React, { useEffect, useState } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios'; 
import { adminIds, initialTags } from '../utils/helpers';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplate from '../hooks/useTemplate';
import { db} from '../config/firebase.config';
import useUser from '../hooks/useUser'
import { replace, useNavigate } from 'react-router-dom';

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: '',
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const [selectTags, setSelectTags] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      isImageLoading: true,
    }));

    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Images');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dzt2dunid/image/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setImageAsset((prevAsset) => ({
                ...prevAsset,
                progress,
              }));
            },
          }
        );

        const downloadURL = response.data.secure_url;
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          uri: downloadURL,
          isImageLoading: false,
        }));

        setFormData((prevFormData) => ({
          ...prevFormData,
          imageURL: downloadURL,
        }));

        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          isImageLoading: false,
        }));
      }
    } else {
      toast.info('Invalid file type');
    }
  };

  const deleteAnImageObject = async () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      uri: null,
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      imageURL: null,
    }));
  };

  const isAllowed = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  };

  const handleSelectTags = (tag) => {
    if (selectTags.includes(tag)) {
      setSelectTags((prevTags) => prevTags.filter((prevTag) => prevTag !== tag));
    } else {
      setSelectTags((prevTags) => [...prevTags, tag]);
    }
  };

  // const handleSubmit = () => {
  //   if (!formData.title || !formData.imageURL) {
  //     toast.error('Please fill out all fields and upload an image.');
  //     return;
  //   }
  //   toast.success('Template created successfully!');
  //   console.log('Template Data:', formData, 'Tags:', selectTags);
  // };

  const pushToCloud = async () => {
    const timeStamps = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectTags,
      name:templates && templates.length > 0 ? `Template${templates.length + 1}` :"Template1" ,
      timeStamps: timeStamps,
    };
    console.log(_doc);
    await setDoc(doc(db,'templates', id), _doc).then(() => {
      setFormData((prevData)=>({...prevData,title:"",imageURL:""}));
      setImageAsset((prevAsset)=>({...prevAsset,uri:null}));
      setSelectTags([]);
      templatesRefetch();
      toast.success('Data pushed to cloud successfully');
    }).catch((err) => {
      console.log(err);
      toast.error('Failed to push data to cloud');
    });
  };

 
//   // function to remove the data from the cloud 
// const removeTemplate = async(template) =>{
//   const deleRef = ref(storage,template?.imageURL)
//   await deleteObject(deleRef).then( async()=>{
//     await deleteDoc(doc(db,"templates",template?._id)).then(()=>{
//       toast.success("Template removed...");
//       templatesRefetch();
//     }).catch(err=>{
//       toast.error(`Error: ${err.message}`);
//     }) 
//   })
// }

const removeTemplate = async (template) => {
  try {
    // Remove the template from Firestore
    await deleteDoc(doc(db, "templates", template._id));

    // Update the UI by filtering out the removed template from the list
    const updatedTemplates = templates.filter(t => t._id !== template._id);
    templatesRefetch(updatedTemplates); // Assuming templatesRefetch is a function to update your templates state

    // Show success message
    toast.success("Template removed successfully");
  } catch (error) {
    // Handle any errors that occur during deletion
    toast.error(`Error: ${error.message}`);
  }
};

const { data:user,isLoading} = useUser()
  const {data:templates,
    // isError:templateisError,
    isLoading:templateIsLoading,
    refetch:templatesRefetch} = useTemplate();

    const navigate = useNavigate()

    useEffect(()=>{
      if (!isLoading && !adminIds.includes(user?.uid)) {
        navigate("/",{replace:true});
      }
    },[user,isLoading])

  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
      {/* Left Container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-1 items-center justify-start flex-col gap-4 px-2'>
        <div className='w-full'>
          <p className='text-lg text-txtPrimary'>Create New Template</p>
        </div>
        <div className='w-full flex items-center justify-end'>
          <p className='text-base text-txtLight uppercase font-semibold'>TEMPID:{" "}</p>
          <p className='text-sm text-txtDark capitalize font-bold'>{templates && templates.length > 0 ? `Template${templates.length + 1}`:"Template1" }</p>
        </div>
        <input
          className='w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus-within:text-txtdark focus:shadow-md outline-none'
          type='text'
          name='title'
          placeholder='Template Title'
          value={formData.title}
          onChange={handleInputChange}
        />
        <div className='w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] 
        rounded-md border-dotted border-2 border-gray-300 cursor-pointer flex items-center justify-center'>
          {imageAsset.isImageLoading ? (
            <div className='flex flex-col items-center justify-center gap-4'>
              <PuffLoader color='#498FCD' size={120} />
              <p className=''>{imageAsset.progress.toFixed(2)}%</p>
            </div>
          ) : !imageAsset?.uri ? (
            <label className='w-full cursor-pointer h-full'>
              <div className='flex flex-col items-center justify-center h-full w-full'>
                <div className='flex items-center justify-center cursor-pointer flex-col gap-4'>
                  <FaUpload className='text-3xl' />
                  <p className='text-lg text-txtLight'>Click to upload</p>
                </div>
              </div>
              <input
                type='file'
                className='w-0 h-0'
                accept='.jpeg,.jpg,.png'
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            <div className='relative w-full h-full overflow-hidden rounded-md'>
              <img
                src={imageAsset.uri}
                alt='template'
                loading='lazy'
                className='w-full h-full object-cover'
              />

             {/* delete section */}
              <div
                className='absolute top-4 right-4 h-8 w-8 bg-red-500 rounded-md flex items-center justify-center cursor-pointer'
                onClick={deleteAnImageObject}
              >
                <FaTrash className='text-md text-white cursor-pointer' />
              </div>
            </div>
          )}
        </div>
        <div className='w-full flex flex-wrap items-center gap-2'>
          {initialTags.map((tag, i) => (
            <div
              key={i}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectTags.includes(tag) ? 'bg-blue-500 text-white' : ""}`}
              onClick={() => handleSelectTags(tag)}
            >
              <p className='text-xs'>{tag}</p>
            </div>
          ))}
        </div>

        {/* button section */}
        <button type='button' className='w-full bg-blue-700 text-white rounded-md py-3' onClick={pushToCloud}>Save</button>
      </div>

      {/* Right Container */}
       <div className='col-span-12 lg:col-span-8 2xl:col-span-9 w-full flex-1 px-2 py-4'>
         {
          templateIsLoading ? ( <React.Fragment>
            <div className='w-full h-full flex items-center justify-center'>
              <PuffLoader color='#498FCD' size={120} />
            </div>
          </React.Fragment>) : (<React.Fragment>
            {
              templates && templates.length > 0 ? 
              (<React.Fragment>
                <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {
                  templates.map(template =>(
                    <div key={template._id} className='w-full h-[500px] rounded-md overflow-hidden relative'>
                      <img src={template.imageURL} alt={template.title} loading='lazy' className='w-full h-full object-cover' />

                    {/* delete section */}

                    <div
                className='absolute top-4 right-4 h-8 w-8 bg-red-500 rounded-md flex items-center justify-center cursor-pointer'
               
              >
                <FaTrash className='text-md text-white cursor-pointer'  onClick={()=>removeTemplate(template)} />
              </div>
                    </div>
                  ))
                }
                </div>
              </React.Fragment>) : 
              (<React.Fragment><div className='w-full h-full flex'>
                <PuffLoader color='#498FCD' size={120} />
                <p className='text-xl tracking-wider capitalize text-txtPrimary'>No Data</p>
              </div></React.Fragment>)
            }
          </React.Fragment>)
         }
       </div>
    </div>
  );
};

export default CreateTemplate;
