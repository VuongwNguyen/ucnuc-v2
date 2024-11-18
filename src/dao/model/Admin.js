import db from "../";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  doc,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";

const adminsCollection = collection(db, "admins");

class Admin {
  static async authAdmin(email) {
    const q = query(adminsCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw new Error("You are not an admin");

    const doc = querySnapshot.docs[0];

    return doc.data();
  }
}

export default Admin;
