class ReverseString {
  constructor(str) {
    this.string = str;
  }
  revString() {
    let r = "";
    for (let i = this.string.length - 1; i >= 0; i--) {
      r += this.string[i];
    }
    return console.log(r);
  }
}

const obj1 = new ReverseString(`How are you?`);

obj1.revString();

/*
class ReverseString {
  //  constructor(str) {
  //    this.string = str;
  //  }
  set input(str) {
    this.string = str;
  }
  get reverseString() {
    return this.revString();
  }
  revString() {
    var r = "";
    for (var i = this.string.length - 1; i >= 0; i--) {
      r += this.string[i];
    }
    return console.log(r);
  }
}

const testString = new ReverseString();
testString.input = `Testtttt`;
testString.reverseString;
*/
