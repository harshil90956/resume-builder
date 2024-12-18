import React from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { GoogleAuthProvider, GithubAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from '../config/firebase.config';

const AuthButtonWithProvider = ({ Icon, label, provider, className }) => {
  const googleAuthProvider = new GoogleAuthProvider();
  const githubAuthProvider = new GithubAuthProvider();

  const handleAuthRedirect = async (provider) => {
    try {
      switch (provider) {
        case "GoogleAuthProvider":
          console.log("I am google auth provider");
          
          await signInWithRedirect(auth, googleAuthProvider);
          break;
        case "GithubAuthProvider":
          console.log("I am github auth provider");
          await signInWithRedirect(auth, githubAuthProvider);
          break;
        default:
          console.log("Unknown provider");
          return;
      }

      // After redirect, check for user details
      const result = await getRedirectResult(auth);
      if (result) {
        console.log(result);
        
        console.log("User info:", result.user);
      }



      
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleClick = () => {
    handleAuthRedirect(provider);
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md ${className}`}
    >
      <Icon className="text-txtPrimary text-xl group-hover:text-white" />
      <p className="text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
    </div>
  );
};

export default AuthButtonWithProvider;
