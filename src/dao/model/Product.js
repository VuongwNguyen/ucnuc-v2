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

class Product {
  constructor(id, name, price, discount, category_id, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.discount = discount;
    this.category_id = category_id;
    this.image = image;
    this.created_at = new Date();
  }
  async create() {
    try {
      const q = query(
        categoriesCollection,
        where("id", "==", this.category_id)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Category does not exist");
      }
      const docRef = await addDoc(collection(db, "products"), {
        id: this.id,
        name: this.name,
        price: this.price,
        discount: this.discount,
        category_id: this.category_id,
        image: this.image,
        created_at: this.created_at,
      });

      return console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
      throw new Error("Error adding document");
    }
  }

  static async read(callback) {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      callback(data);
    });
    return unsubscribe;
  }

  static priceDiscount(price, discount) {
    if (discount === 0) {
      return price;
    } else {
      return price - (price * discount) / 100;
    }
  }
}

export default Product;
