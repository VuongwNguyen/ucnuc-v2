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
  constructor(customer_name, customer_id, table_id, table_name, orders, total) {
    this.id = uuidv4();
    this.customer_name = customer_name;
    this.customer_id = customer_id;
    this.table_id = table_id;
    this.table_name = table_name;
    this.orders = orders;
    this.total = total;
    this.status = "pending"; // pending, processing, completed, canceled
    this.methodPay = "cash"; // cash, card
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

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let order = null;

      order = querySnapshot.docs.map((doc) => doc.data())[0];

      callback(order);
    });

    return unsubscribe;
  }

  static async read(callback) {
    const q = query(
      collection(db, "orders"),
      where(
        "status",
        "in",
        ["pending", "processing"],
        orderBy("created_at", "asc")
      )
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      callback(orders);
    });

    return unsubscribe;
  }

  static async changePayStatus(id, refPay = null,) {
    const q = query(ordersCollection, where("id", "==", id));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        payStatus: "paid",
        refPay: refPay,
        methodPay: refPay ? "card" : "cash",
      });
    });

    console.log("Document successfully updated!");

    return Promise.resolve();
  }

  static async changeStatus(id, status) {
    const q = query(ordersCollection, where("id", "==", id));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        status: status,
      });
    });

    console.log("Document successfully updated!");

    return Promise.resolve();
  }
}

export default Order;
