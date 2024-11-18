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

const ordersCollection = collection(db, "orders");

class Order {
  constructor(
    customer_name,
    customer_id,
    table_id,
    table_name,
    orders,
    total,
    methodPay
  ) {
    this.id = uuidv4();
    this.customer_name = customer_name;
    this.customer_id = customer_id;
    this.table_id = table_id;
    this.table_name = table_name;
    this.orders = orders;
    this.total = total;
    this.status = "pending"; // pending, completed, canceled
    this.methodPay = methodPay;
    this.refPay = null;
    this.payStatus = "unpaid"; // unpaid, paid
    this.created_at = new Date();
  }

  async create() {
    const docRef = await addDoc(ordersCollection, {
      id: this.id,
      customer_name: this.customer_name,
      customer_id: this.customer_id,
      table_id: this.table_id,
      table_name: this.table_name,
      orders: this.orders,
      total: this.total,
      status: this.status,
      methodPay: this.methodPay,
      payStatus: this.payStatus,
      created_at: this.created_at,
    });
    console.log("Document written with ID: ", docRef.id);

    return Promise.resolve(this.id);
  }

  static listenToOrder(id, callback) {
    const q = query(ordersCollection, where("id", "==", id));

    // Đăng ký listener để nhận dữ liệu real-time
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let order = null;

      // Lấy dữ liệu từ snapshot
      order = querySnapshot.docs.map((doc) => doc.data())[0];

      // Gọi callback với dữ liệu mới nhất
      callback(order);
    });

    // Trả về hàm hủy đăng ký để có thể dừng lắng nghe khi cần
    return unsubscribe;
  }

  static async read(callback) {
    const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      callback(orders);
    });

    return unsubscribe;
  }

  static async changePayStatus(id, refPay) {
    const q = query(ordersCollection, where("id", "==", id));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        payStatus: "paid",
        refPay: refPay,
      });
    });

    console.log("Document successfully updated!");

    return Promise.resolve();
  }
}

export default Order;
