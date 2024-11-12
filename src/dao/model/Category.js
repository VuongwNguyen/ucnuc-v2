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
const categoriesCollection = collection(db, "categories");
import { v4 as uuidv4 } from "uuid";

class Category {
  constructor(name, description, tag) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.tag = tag;
    this.createdAt = new Date();
  }

  async create() {
    const q = query(categoriesCollection, where("name", "==", this.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("Category already exists");
    }

    const docRef = await addDoc(categoriesCollection, {
      id: this.id,
      name: this.name,
      description: this.description,
      tag: this.tag,
      createdAt: this.createdAt,
    });
    console.log("Document written with ID: ", docRef.id);
    return Promise.resolve(docRef.id);
  }

  static async read(callback) {
    const q = query(categoriesCollection, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      callback(categories);
    });
    return unsubscribe;
  }

  static async getCategory(id) {
    const q = query(categoriesCollection, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Giả sử bạn chỉ mong muốn lấy một tài liệu (nếu tồn tại)
      return querySnapshot.docs[0].data();
    } else {
      throw new Error("No such document!");
    }
  }
}

export default Category;
