import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

export const getUserDetails = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];
       console.log("userdata",userData);
       const unsubscribe = onSnapshot(doc(db,"users",userData?.uid),(_doc)=>{
        if(_doc.exists()){
          resolve(_doc.data())
        }else{
          setDoc(doc(db,"users",userData?.uid),userData).then(()=>{
            resolve(userData);
          })
        }
       });
       return unsubscribe
      } else {
        reject(new Error("User is not authenticated"));
        // Unsubscribe if no user is authenticated
      }

      unsubscribe();
    });
  });
};
