import React from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../config/firebase.config';

const AuthButtonWithProvider = ({ Icon, label, provider, className }) => {
  const googleAuthProvider = new GoogleAuthProvider();
  const githubAuthProvider = new GithubAuthProvider();

  const handleAuthPopup = async (provider) => {
    try {
      let result;
      switch (provider) {
        case "GoogleAuthProvider":
          console.log("I am Google Auth Provider");
          result = await signInWithPopup(auth, googleAuthProvider);
          break;
        case "GithubAuthProvider":
          console.log("I am GitHub Auth Provider");
          result = await signInWithPopup(auth, githubAuthProvider);
          break;
        default:
          console.log("Unknown provider");
          return;
      }

      if (result) {
        console.log("Authentication successful!");
        console.log("User info:", result.user);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleClick = () => {
    handleAuthPopup(provider);
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full px-4 py-3 rounded-lg border-2 border-blue-600 flex items-center justify-between cursor-pointer group hover:bg-blue-600 active:scale-95 transition duration-150 ease-in-out hover:shadow-lg ${className}`}
    >
      <Icon className="text-blue-600 text-xl group-hover:text-white transition duration-150 ease-in-out" />
      <p className="text-blue-600 text-lg group-hover:text-white transition duration-150 ease-in-out">{label}</p>
      <FaChevronRight className="text-blue-600 text-base group-hover:text-white transition duration-150 ease-in-out" />
    </div>
  );
};

export default AuthButtonWithProvider;
