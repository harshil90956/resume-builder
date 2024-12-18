import React, { useState } from 'react';
import useUser from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { Logo } from '../assets';
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from 'react-spinners';
import { AiOutlineLogout } from 'react-icons/ai';
import { FadeInOutWithOpacity, slideUpDownMenu } from '../animations';
import { useQueryClient } from 'react-query';
import { auth } from '../config/firebase.config';

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
                                        <motion.div {...slideUpDownMenu} onMouseLeave={() => setisMenu(false)}
                                            className="absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                                        >
                                            {data?.photoURL ? (
                                                <div className="w-20 h-20 rounded-full relative flex flex-col items-center justify-center">
                                                    <img
                                                        src={data?.photoURL}
                                                        alt="User Profile"
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md">
                                                    <p className="text-lg text-white cursor-pointer">{data?.email[0]}</p>
                                                </div>
                                            )}
                                            {data?.displayName && (<p className="text-3xl text-txtDark cursor-pointer">{data?.displayName}</p>)}

                                            {/* Menu options */}
                                            <div className='w-full flex-col items-start flex gap-8 pt-6'>
                                                <Link className='text-txtLight hover:text-txtdark text-base whitespace-nowrap' to={"/profile"}>MY Account</Link>
                                                <Link className='text-txtLight hover:text-txtdark text-base whitespace-nowrap' to={"/template/create"}>ADD new template</Link>
                                                <div className='w-full px-2 py-2 border-gray-300 flex items-center justify-between group'>
                                                    <p className="group-hover:text-txtdark text-txtLight cursor-pointer" onClick={signOutUser}>Sign out</p>
                                                    <AiOutlineLogout className="group-hover:text-txtdark text-txtLight" />
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
