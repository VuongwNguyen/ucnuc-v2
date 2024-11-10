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

class Category {
  constructor(id, name, description, tag) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.tag = tag;
    this.createdAt = new Date();
  }

  async create() {
    try {
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

      return console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
      throw new Error("Error adding document");
    }
  }
  static async read(callback) {
    const q = query(categoriesCollection);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      callback(categories);
    });
    return unsubscribe;
  }
}
export default Category;
