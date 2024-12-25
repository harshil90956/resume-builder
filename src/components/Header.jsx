import React, { useState } from 'react';
import useUser from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { Logo } from '../assets';
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from 'react-spinners';
import { AiOutlineLogout } from 'react-icons/ai';
import { FadeInOutWithOpacity,  } from '../animations';
import { useQueryClient } from 'react-query';
import { auth } from '../config/firebase.config';
import { adminIds } from '../utils/helpers';

const Header = () => {
    const { data, isLoading } = useUser();
    const [isMenu, setisMenu] = useState(false);
    const queryClient = useQueryClient();

    const signOutUser = async () => {
        await auth.signOut().then(() => {
            queryClient.setQueryData("user", null);
        });
    };

    return (
        <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 sticky top-0">
            {/* Logo */}
            <Link to="/" className="w-12 h-auto object-contain mr-4">
                <img src={Logo} alt="Logo" />
            </Link>

            {/* Search Input */}
            <div className="flex-1 border border-gray-300 px-4 py-1 rounded-b-md flex items-center justify-center bg-gray-200">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="flex-1 h-8 px-4 bg-transparent text-base font-semibold outline-none border-none"
                />
            </div>

            {/* Add space between Search Input and Profile Section */}
            <div className="mx-4"></div> {/* This div adds horizontal space */}

            {/* Profile Section */}
            <AnimatePresence>
                {isLoading ? (
                    <PuffLoader color="#a98FCD" size={40} />
                ) : (
                    <React.Fragment>
                        {data ? (
                            <motion.div {...FadeInOutWithOpacity} className="relative" onClick={() => setisMenu(!isMenu)}>
                                {/* Profile Picture */}
                                {data?.photoURL ? (
                                    <div className="w-12 h-12 rounded-md relative flex items-center justify-center">
                                        <img
                                            src={data?.photoURL}
                                            alt="User Profile"
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md">
                                        <p className="text-lg text-white cursor-pointer">{data?.email[0]}</p>
                                    </div>
                                )}

                                {/* Dropdown Menu */}
                                <AnimatePresence>
  {isMenu && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseLeave={() => setisMenu(false)}
      className="absolute px-6 py-4 rounded-lg bg-white shadow-lg right-0 top-14 flex flex-col items-center justify-start gap-4 w-72"
    >
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center gap-2">
        {data?.photoURL ? (
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
            <img
              src={data?.photoURL}
              alt="User Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-700 shadow-md">
            <p className="text-lg text-white font-bold">
              {data?.email?.[0]?.toUpperCase()}
            </p>
          </div>
        )}
        {data?.displayName && (
          <p className="text-lg text-gray-800 font-medium">{data?.displayName}</p>
        )}
      </div>

      {/* Menu Options */}
      <div className="w-full flex flex-col items-start gap-4">
        <Link
          to="/profile"
          className="text-gray-600 hover:text-gray-900 text-base font-medium"
        >
          My Account
        </Link>

        {
            adminIds.includes(data?.uid) && (
                <Link
                to="/template/create"
                className="text-gray-600 hover:text-gray-900 text-base font-medium"
              >
                Add New Template
              </Link>)

        }
       
        <div
          className="w-full flex items-center justify-between cursor-pointer hover:text-gray-900 text-gray-600"
          onClick={signOutUser}
        >
          <p className="text-base font-medium">Sign Out</p>
          <AiOutlineLogout className="text-lg" />
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
                            </motion.div>
                        ) : (
                            <Link to="/auth">
                                <motion.button className='px-4 py-2 rounded-md border border-gray-100 bg-gray-200 hover:shadow-md active:scale-95 duration-150' type='button' {...FadeInOutWithOpacity}>Login</motion.button>
                            </Link>
                        )}
                    </React.Fragment>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
