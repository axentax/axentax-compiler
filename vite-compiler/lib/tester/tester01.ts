import { Tester02 } from "./tester02";

export class Tester01 {

  static method() {
    return 123 + Tester02.method();
  }

}


