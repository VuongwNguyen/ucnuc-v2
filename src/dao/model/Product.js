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
import Category from "./Category";
const productsCollection = collection(db, "products");
import { v4 as uuidv4 } from "uuid";

class Product {
  constructor(options = [], category_id, discount, image) {
    this.id = uuidv4();
    this.option = options.map((opt) => ({
      id: opt.id || uuidv4(),
      name: opt.name,
      price: opt.price,
    }));
    this.category_id = category_id;
    this.discount = discount;
    this.image = image;
    this.created_at = new Date();
  }

  constructor(id, options, category_id, discount, image, created_at) {
    this.id = id||uuidv4();
    this.option = options.map((opt) => ({
      id: opt.id || uuidv4(),
      name: opt.name,
      price: opt.price,
    }));
    this.category_id = category_id;
    this.discount = discount;
    this.image = image;
    this.created_at = created_at;
  }

  async create() {
    const docRef = await addDoc(productsCollection, {
      id: this.id,
      option: this.option,
      category_id: this.category_id,
      discount: this.discount,
      image: this.image,
      created_at: this.created_at,
    });
    return docRef;
  }

  async update() {
    
  }

  static read(callback) {
    const unsubscribe = onSnapshot(
      productsCollection,
      async (querySnapshot) => {
        let products = [];

        // Sử dụng Promise.all() để xử lý dữ liệu bất đồng bộ khi có thay đổi
        products = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const productData = doc.data();
            const cate = await Category.getCategory(productData.category_id);
            return {
              ...productData,
              category_name: cate ? cate.name : "Unknown",
            };
          })
        );

        // Gọi lại callback với dữ liệu sản phẩm đã được xử lý
        callback(products);
      }
    );

    return unsubscribe; // Trả về để có thể huỷ đăng ký cập nhật khi cần
  }

  static priceFormatter(price, discount) {
    let finalPrice = price;
    if (discount) finalPrice = price - discount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(finalPrice);
  }
  static formatCurrency(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }
}

export default Product;
