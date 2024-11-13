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
      id: uuidv4(),
      name: opt.name,
      price: opt.price,
    }));
    this.category_id = category_id;
    this.discount = discount;
    this.image = image;
    this.created_at = new Date();
  }

  async create() {
    console.log("Creating product:", this);
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

  static read(callback, category_id = null) {
    let q = productsCollection;

    // Nếu category_id được cung cấp, thêm bộ lọc cho category_id
    if (category_id) {
      q = query(q, where("category_id", "==", category_id)); // Lọc theo category_id
    }

    // Đăng ký snapshot để lắng nghe thay đổi trong Firestore
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let products = [];

      // Dùng Promise.all để xử lý dữ liệu bất đồng bộ
      products = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const productData = doc.data();

          // Lấy tên danh mục từ bảng Category
          const cate = await Category.getCategory(productData.category_id);
          return {
            ...productData,
            category_name: cate ? cate.name : "Unknown", // Thêm tên danh mục vào dữ liệu sản phẩm
          };
        })
      );

      // Gọi lại callback với dữ liệu sản phẩm đã được xử lý
      callback(products);
    });

    return unsubscribe; // Trả về hàm hủy đăng ký để có thể hủy theo dõi khi cần
  }

  static async update({
    id,
    options,
    category_id,
    discount,
    image,
    created_at,
  }) {
    try {
      const q = query(productsCollection, where("id", "==", id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Product not found");
      }

      const data = {
        id,
        option: options.map((opt) => ({
          id: opt.id ? opt.id : uuidv4(),
          name: opt.name,
          price: opt.price,
        })),
        category_id,
        discount,
        image,
        created_at,
      };

      // Cập nhật tài liệu trong Firestore
      await updateDoc(querySnapshot.docs[0].ref, data);
    } catch (error) {
      console.error("Error updating product data:", error);
      throw error;
    }
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
