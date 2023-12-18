import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as signInWithEmailPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9MR94KTIm6R5rnLTIGVoELdaN1ESjAvE",
  authDomain: "job-sheet-591b5.firebaseapp.com",
  projectId: "job-sheet-591b5",
  storageBucket: "job-sheet-591b5.appspot.com",
  messagingSenderId: "517021799157",
  appId: "1:517021799157:web:b8db744f904060605eabbc",
  measurementId: "G-LNF3XX70PY",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const db = getFirestore(app);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      console.log("User signed up successfully:", userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Error signing up user:", error.message);
      throw error;
    }
  };
  

  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailPassword(
        firebaseAuth,
        email,
        password
      );
      console.log("User signed in successfully:", userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Error signing in user:", error.message);
      throw error;
    }
  };

  const storeData = async (collectionKey, documentId, data) => {
    try {
      const docRef = doc(db, collectionKey, documentId);
      await setDoc(
        docRef,
        {
          tasks: arrayUnion(data),
        },
        { merge: true }
      );

      console.log("Document updated with ID:", documentId);
      return docRef;
    } catch (error) {
      console.error("Error updating data in Context:", error.message);
      throw error;
    }
  };

  const fetchAssigneeList = async (collectionKey) => {
    try {
      const usersCollectionRef = collection(db, collectionKey);
      const usersSnapshot = await getDocs(usersCollectionRef);

      const assigneeList = [];
      usersSnapshot.forEach((userDoc) => {
        assigneeList.push(userDoc.id);
      });

      console.log("Assignee list:", assigneeList);
      return assigneeList;
    } catch (error) {
      console.error("Error fetching assignee list:", error.message);
      throw error;
    }
  };

  const fetchAssigneeData = async (collectionKey, documentId) => {
    try {
      const docRef = doc(db, collectionKey, documentId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log("Assignee data:", data);

        return {
          documentId: docSnapshot.id,
          ...data,
        };
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from Context:", error.message);
      throw error;
    }
  };

  const editAssigneeData = async (collectionKey, documentId, updatedData) => {
    try {
      const docRef = doc(db, collectionKey, documentId);

      // Fetch the current data
      const currentData = await fetchAssigneeData(collectionKey, documentId);

      if (!currentData) {
        // Handle the case where the document does not exist
        console.log("No such document to edit!");
        return null;
      }

      // Merge the updated data with the current data
      const newData = { ...currentData, ...updatedData };

      // Update the document with the merged data
      await updateDoc(docRef, newData);

      console.log("Assignee data updated successfully:", newData);

      return {
        documentId: docRef.id,
        ...newData,
      };
    } catch (error) {
      console.error("Error editing assignee data:", error.message);
      throw error;
    }
  };

  const deleteAssigneeData = async (collectionKey, documentId, taskIndex) => {
    try {
      const docRef = doc(db, collectionKey, documentId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();

        // Ensure the tasks array exists and contains the task to be deleted
        if (userData.tasks && userData.tasks.length > taskIndex) {
          // Delete the specified task
          userData.tasks.splice(taskIndex, 1);

          // Update the user document with the modified tasks array
          await updateDoc(docRef, {
            tasks: userData.tasks,
          });

          console.log("Task deleted successfully.");
          return true; // Indicate successful deletion
        } else {
          console.log("Task not found in user data.");
          return false; // Indicate that the task was not found
        }
      } else {
        console.log("User document does not exist.");
        return false; // Indicate that the user document does not exist
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    const user = firebaseAuth.currentUser;
  
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const decodedToken = jwt_decode(idToken);
        const userId = decodedToken.uid;
  
        // Fetch additional user information from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));
  
        if (userDoc.exists()) {
          const additionalUserInfo = userDoc.data();
          console.log('Additional user information:', additionalUserInfo);
  
          return {
            email: user.email,
            uid: userId,
            additionalUserInfo,
          };
        } else {
          console.log('No such document for user:', userId);
          return null;
        }
      } catch (error) {
        console.error('Error getting user information:', error.message);
        throw error;
      }
    } else {
      console.warn('No user is currently authenticated.');
      return null;
    }
  };
  
  
  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        storeData,
        signInWithEmailAndPassword,
        fetchAssigneeList,
        fetchAssigneeData,
        editAssigneeData,
        deleteAssigneeData,
        getCurrentUser,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
};
