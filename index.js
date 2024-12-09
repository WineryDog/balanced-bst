import prettyPrint from './pprint.js';
import Tree from './binary-tree.js';

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function genRandomArr(indexes, maxValue) {
  let randomArr = [];
  while (randomArr.length < indexes) {
    const newNumber = getRandomIntInclusive(0, maxValue);
    randomArr.push(newNumber);
    randomArr = [...new Set(randomArr)];
  }
  return randomArr;
}

const randomArr = genRandomArr(7, 99);

const balancedBst = new Tree(randomArr);

prettyPrint(balancedBst.root);

console.log(balancedBst.isBalanced()); // true

console.log(balancedBst.levelOrder(balancedBst.returnData));
console.log(balancedBst.preOrder(balancedBst.returnData));
console.log(balancedBst.postOrder(balancedBst.returnData));
console.log(balancedBst.inOrder(balancedBst.returnData));

balancedBst.insert(102);
balancedBst.insert(104);
balancedBst.insert(126);

prettyPrint(balancedBst.root);

console.log(balancedBst.isBalanced()); // false

balancedBst.rebalance();
prettyPrint(balancedBst.root);

console.log(balancedBst.isBalanced()); // true
