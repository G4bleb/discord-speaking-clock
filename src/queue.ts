interface queueInterface<Type> {
  enQueue(dataItem: Type): void;
  deQueue(): Type | undefined;
  isEmpty(): boolean;
  size(): number;
  printQueue(): void;
}

class Queue<Type> {
  private data: Type[];
  constructor() {
    this.data = [];
  }
  enqueue(item: Type): void {
    this.data.push(item);
  }
  dequeue(): Type | undefined {
    return this.data.shift();
  }
  isempty(): boolean {
    return !!this.data.length;
  }
}
