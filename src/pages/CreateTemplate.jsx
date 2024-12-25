import React, { useState } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios'; 

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

  // Handling input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  // Handle image file changes
  const handleFileSelect = async (e) => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      isImageLoading: true,
    }));

    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Images'); // Replace with your Cloudinary upload preset

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dzt2dunid/image/upload', // Replace with your Cloudinary cloud name
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

        // Once upload is complete
        const downloadURL = response.data.secure_url; // Cloudinary URL
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

  // Delete an image object
  const deleteAnImageObject = async () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      uri: null,
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      imageURL: null,
    }));

  }

  const isAllowed = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  };

  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12 '>
      {/* left container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-1  items-center justify-start flex-col gap-4 px-2'>
       <div className='w-full'>
       <p className='text-lg text-txtPrimary'>Create New Template</p>
       </div>
        {/* template id section  */}
        <div className='w-full flex items-center justify-end'>
          <p className='text-base text-txtLight uppercase font-semibold'>TEMPID:{" "}</p>
          <p className='text-sm text-txtDark capitalize font-bold'>temaplate1</p>
        </div>

        {/* tempalte titke section  */}
        <input className='w-full px-4 py-3 rounded-md bg-transparent border
        border-gray-300 text-lg text-txtPrimary
        focus-within:text-txtdark focus:shadow-md outline-none' 
        type='text' 
        name='title' 
        placeholder='Template Title' 
        value={formData.title} 
        onChange={handleInputChange}/>

        {/* file uploader section  */}

<div className='w-full bg-gray-100 backdrop-blur-md  h-[420px] lg:h-[620px] 2xl:h-[740px] 
   rounded-md border-dotted border-2 border-gray-300 cursor-pointer flex items-center justify-center 
   '>
     {
      imageAsset.isImageLoading ? 
      (<React.Fragment>
     <div className='flex flex-col items-center justify-center gap-4 '>
        <PuffLoader color='#498FCD' size={120}/>
        <p className=''>{imageAsset.progress.toFixed(2)}%</p>
        </div>
      </React.Fragment>):
      (
      <React.Fragment>
        {
          !imageAsset?.uri ? (
          <React.Fragment>
        <label className='w-full cursor-pointer h-full'>
          <div className='flex flex-col items-center justify-center
          h-full w-full'>
             <div className='flex items-center justify-center cursor-pointer flex-col gap-4'>
             <FaUpload className='text-3xl'/>
              <p className='text-lg text-txtLight'>Click to upload</p>
             </div>
          </div>
          <input type='file'
          className='w-0 h-0' 
          accept='.jpeg,.jpg,.png'
          onChange={handleFileSelect}/>
        </label>
          </React.Fragment>) 
          :(<React.Fragment>
            <div className='reletive w-full h-full overflow-hidden
            rounded-md'>
              <img src={imageAsset.uri} alt='template' 
              loading='lazy'
              className='w-full h-full object-cover'/>
             
             {/* delete section */}
              <div className='absolute top-4 right-4 h-8 w-8 bg-red-500 rounded-md 
              flex items-center justify-center cursor-pointer' onClick={deleteAnImageObject}>
                <FaTrash className='text-md text-white cursor-pointer'/>
                </div>

            </div>
          </React.Fragment>)
        }
      </React.Fragment>
    )
     }
   </div>

      </div>


   

     
      {/* right container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9'>2</div>
    </div>
  );
};

export default CreateTemplate;
