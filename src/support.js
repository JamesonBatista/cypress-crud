import { crudStorage } from "./gherkin/bdd";

let conterif =()=> crudStorage.counter.int
let compare;
export function t(text) {
if(!compare || conterif() !== compare){
  crudStorage.num.counter = 1;
  compare = conterif()
}

return `${String(crudStorage.num.counter++).padStart(2, "0")} - ${text}`;
}

export function d(text) {
  return `${String(crudStorage.counter.int++).padStart(2, "0")} ➠ ${text}`;
}