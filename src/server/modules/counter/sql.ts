
export default class Counter {
  count: object;
  constructor(){
    this.count = {amount: 1}
  }
  counterQuery() {
    return this.count
  }

  addCounter(amount: number) {
    this.count.amount = amount+this.count.amount
    return this.count
  }
}
