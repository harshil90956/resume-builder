import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
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

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      // Corrected "acs" to "asc"
    );

    const unsubscribe = onSnapshot(
      templateQuery,
      (querySnap) => {
        if (!querySnap.empty) {
          const templates = querySnap.docs.map((doc) => doc.data());
          resolve(templates);
        } else {
          console.warn("No documents found in the templates collection.");
          resolve([]); // Return an empty array if no documents
        }
      },
      (error) => {
        console.error("Error fetching templates:", error);
        reject(error);
      }
    );

    return unsubscribe; // Return the unsubscribe function for cleanup
  });
};

