import { v4 as uuidv4 } from "uuid";

class Order {
  #id = uuidv4();
  #customer_name = "";
  #table_id = "";
  #orders = [];
  #total = 0;
  #status = "Pending"; // Pending, Done, Cancelled
  #methodPay = "Cash"; // Cash, Card, Momo, Other v.v
  #payStatus = "Unpaid";
  #created_at = new Date();

  constructor(
    customer_name,
    table_id,
    orders,
    total,
    status,
    methodPay,
    payStatus,
    created_at
  ) {
    this.#customer_name = customer_name;
    this.#table_id = table_id;
    this.#orders = orders;
    this.#total = total;
    this.#status = status;
    this.#methodPay = methodPay;
    this.#payStatus = payStatus;
    this.#created_at = created_at;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get customer_name() {
    return this.#customer_name;
  }

  set customer_name(value) {
    this.#customer_name = value;
  }

  get table_id() {
    return this.#table_id;
  }

  set table_id(value) {
    this.#table_id = value;
  }

  get orders() {
    return this.#orders;
  }

  set orders(value) {
    this.#orders = value;
  }

  get total() {
    return this.#total;
  }

  set total(value) {
    this.#total = value;
  }

  get status() {
    return this.#status;
  }

  set status(value) {
    this.#status = value;
  }

  get methodPay() {
    return this.#methodPay;
  }

  set methodPay(value) {
    this.#methodPay = value;
  }

  get payStatus() {
    return this.#payStatus;
  }

  set payStatus(value) {
    this.#payStatus = value;
  }

  get created_at() {
    return this.#created_at;
  }

  set created_at(value) {
    this.#created_at = value;
  }
}

export default Order;
