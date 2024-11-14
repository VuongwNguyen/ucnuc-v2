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
const tablesCollection = collection(db, "tables");

class Table {
  constructor(id, name, customer_id = null) {
    this.id = id || uuidv4();
    this.name = name;
    this.customer_id = customer_id;
  }

  // Create a new table
  async createTable() {
    const q = query(tablesCollection, where("name", "==", this.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) return Promise.reject("Tên bàn đã tồn tại");

    const docRef = await addDoc(tablesCollection, {
      id: this.id,
      name: this.name,
      customer_id: this.customer_id,
    });
    return docRef;
  }
  // real-time listener
  static async read(callback) {
    const q = query(tablesCollection);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tables = [];
      querySnapshot.forEach((doc) => {
        tables.push(doc.data());
      });
      callback(tables);
    });
    return unsubscribe;
  }

  static async joinTable(table_id, customer_id) {
    const tableRef = doc(tablesCollection, table_id);
    await updateDoc(tableRef, {
      customer_id: customer_id,
    });
  }
}

export default Table;
