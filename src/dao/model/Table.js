import db from "..";

class Table {
  constructor(id, name, customer_id) {
    this.id = id;
    this.name = name;
    this.customer_id = customer_id;
  }

  // Create a new table
  async createTable() {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "tables"), {
      name: this.name,
      customer_id: this.customer_id,
      seats: this.seats,
    });
    console.log("Document written with ID: ", docRef.id);
  }
  // real-time listener
  async getTables() {
    const q = query(collection(db, "tables"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  }
}

export default Table;
