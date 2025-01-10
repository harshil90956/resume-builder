import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

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


export const saveToCollection = async (user, data) => {
  const docRef = doc(db, "users", user?.uid);

  if (user?.collection && Array.isArray(user.collection) && user.collection.includes(data?._id)) {
    // If item is already in the collection, remove it
    await updateDoc(docRef, { 
      collection: arrayRemove(data?._id)  // Ensure the field name is "collection"
    })
      .then(() => {
        toast.success("Removed from collection");
      })
      .catch((err) => {
        console.error("Error removing from collection:", err);
        toast.error("Error removing from collection");
      });
  } else {
    // If item is not in the collection, add it
    await updateDoc(docRef, { 
      collection: arrayUnion(data?._id)  // Ensure the field name is "collection"
    })
      .then(() => {
        toast.success("Added to collection");
      })
      .catch((err) => {
        console.error("Error adding to collection:", err);
        toast.error("Error adding to collection");
      });
  }
};


export const saveToFavourites = async (user, data) => {
  const docRef = doc(db, "templates", data?._id);

  if (data?.favourites && Array.isArray(data.favourites) && !data.favourites.includes(user?.uid)) {
    await updateDoc(docRef, { favourites: arrayUnion(user?.uid) })
      .then(() => {
        toast.success("Added to favourites");
      })
      .catch((err) => {
        console.error("Error adding to favourites:", err);
        toast.error("Error adding to favourites");
      });
  } else {
    await updateDoc(docRef, { favourites: arrayRemove(user?.uid) })
      .then(() => {
        toast.success("Removed from favourites");
      })
      .catch((err) => {
        console.error("Error removing from favourites:", err);
        toast.error("Error removing from favourites");
      });
  }
}


export const getTemplateDetails = async (templateID) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
     doc(db, "templates", templateID),(doc)=>{
      resolve(doc.data());
     }
    );

    return unsubscribe; // Return the unsubscribe function for cleanup
  });
}


export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data) {
            resolve(data);
          } else {
            reject(new Error("Data is undefined"));
          }
        } else {
          reject(new Error("Document does not exist"));
        }
      },
      (error) => {
        reject(error);
      }
    );

    return unsubscribe;
  });
};

export const getSavedResumes = (uid)=>{
  return new Promise((resolve,reject)=>{
    const templateQuery = query(
      collection(db,"users",uid,"resumes"),
      orderBy("timeStamp","asc")
    );
    const unsubscribe = onSnapshot(templateQuery,(querySnap)=>{
      const templates = querySnap.docs.map((doc)=>doc.data());
      resolve(templates);
    })
    return unsubscribe;
  })
}