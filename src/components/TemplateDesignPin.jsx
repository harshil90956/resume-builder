import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeInOutWithOpacity, scaleInout } from '../animations';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import { saveToCollection, saveToFavourites } from '../api';
import useTemplate from '../hooks/useTemplate';
import { useNavigate } from 'react-router-dom';

const TemplateDesignPin = ({ data, index }) => {

    const {data:user,refetch:userRefecth} = useUser();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);
    const { refetch:temp_Refetch } = useTemplate();
    const navigate = useNavigate()

    useEffect(() => {
        setIsFavourite(data?.favourites?.includes(user?.uid));
    }, [data, user]);

    const addToCollection = async (e) => { 
        e.stopPropagation();
        await saveToCollection(user,data);
        userRefecth();
     };
    const addToFavourites = async (e) => {  
        e.stopPropagation();
        await saveToFavourites(user, data);
        userRefecth();
        temp_Refetch();
        setIsFavourite(!isFavourite); // Toggle the favourite state
    };

    const handleRouteNavigation = (e) => {
      navigate(`/resumeDetails/${data?._id}`,{replace:true});
    }

    return (
        <motion.div
            key={data?._id}
            {...scaleInout(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-[600px] 2x1:h-[740px] rounded-md bg-white shadow-md overflow-hidden relative"
        >
            <div className="w-full h-[600px] 2x1:h-[740px] rounded-md bg-gray-300 overflow-hidden relative">
                <img
                    className="w-full h-full object-cover"
                    src={data?.imageURL}
                    alt="Design Preview"
                />
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            {...FadeInOutWithOpacity}
                            onClick={handleRouteNavigation}
                            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50"
                        >
                            <div className="flex flex-col items-end justify-start gap-8 w-full">
                                <InnerBoxCard
                                    label={user?.collection?.includes(data?._id) ? "Added To Collection" : "Add To Collection"}
                                    Icon={user?.collection?.includes(data?._id) ? BiSolidFolderPlus : BiFolderPlus}
                                    onHandle={addToCollection}
                                />
                                <InnerBoxCard
                                    label={isFavourite ? "Added To Favourites" : "Add To Favourites"}
                                    Icon={isFavourite ? BiSolidHeart : BiHeart}
                                    onHandle={addToFavourites}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onHandle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
        >
            <Icon className="text-txtPrimary text-base" />
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.6, x: 50 }}
                        className="px-3 py-2 rounded-md bg-gray-300 absolute -left-44 shadow-lg"
                    >
                        <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TemplateDesignPin;
