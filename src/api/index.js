import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

export const getUserDetails = () => {
    return new Promise((resolve, reject) => {
        const authUnsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                console.log("usercred", userCred);

                const userData = userCred.providerData[0];
                console.log(userData);

                const snapshotUnsubscribe = onSnapshot(
                    doc(db, "users", userData?.uid),
                    (_doc) => {
                        if (_doc.exists()) {
                            resolve(_doc.data());
                        } else {
                            setDoc(doc(db, "users", userData?.uid), userData)
                                .then(() => resolve(userData))
                                .catch((err) => reject(err));
                        }
                    }
                );

                // Unsubscribe auth listener
                authUnsubscribe();

                // Return the onSnapshot unsubscribe function
                return snapshotUnsubscribe;
            } else {
                reject(new Error("User is not Authenticated"));
                authUnsubscribe(); // Unsubscribe auth listener if unauthenticated
            }
        });
    });
};
