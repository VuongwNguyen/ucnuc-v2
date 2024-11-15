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
import { v4 as uuidv4 } from "uuid";

const customersCollection = collection(db, "customers");

class Customer {
  #customer_id = "";
  #email = "";
  #username = "";

  constructor(username, email) {
    this.#username = username;
    this.#customer_id = uuidv4();
    this.#email = email;
  }

  async authCustomer() {
    const q = query(customersCollection, where("email", "==", this.#email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Đăng ký mới nếu chưa tồn tại
      const docRef = await addDoc(customersCollection, {
        customer_id: this.#customer_id,
        username: this.#username,
        email: this.#email,
      });
      const newDoc = await getDoc(docRef);
      return newDoc.data(); // Trả về dữ liệu người dùng mới
    } else {
      // Trả về thông tin người dùng đã tồn tại
      const doc = querySnapshot.docs[0];
      return doc.data();
    }
  }
}

export default Customer;
