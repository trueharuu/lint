const q = true > false;
class L {
  get [Symbol.toPrimitive]() {
    return 1;
  }
}

new L() > new L();
