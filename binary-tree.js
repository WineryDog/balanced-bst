import Node from './node.js';

class Tree {
  constructor(array) {
    const uniqueSorted = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(uniqueSorted);
  }

  buildTree(arr) {
    if (arr.length === 0) return null;
    const mid = Math.floor((arr.length - 1) / 2);
    const treeRoot = Node(arr[mid]);
    treeRoot.left = this.buildTree(arr.slice(0, mid));
    treeRoot.right = this.buildTree(arr.slice(mid + 1));
    return treeRoot;
  }

  insert(value) {
    const [, nodeRoot] = this.traverse(value, this.root);
    if (nodeRoot.data === value) {
      return 'Value exists';
    }
    value < nodeRoot.data
      ? (nodeRoot.left = Node(value))
      : (nodeRoot.right = Node(value));
  }

  find(value, operation = null) {
    const [currentNode, parent, parentDirection, depth] = this.traverse(
      value,
      this.root
    );
    if (currentNode) {
      if (currentNode.data === value) {
        const result =
          operation === 'delete'
            ? [currentNode, parent, parentDirection]
            : operation === 'depth'
            ? [currentNode, depth]
            : currentNode; // default

        return result;
      }
    } else {
      return 'Value not found';
    }
  }

  deleteItem(value) {
    const [currentNode, parent, parentDirection] = this.find(value, 'delete');

    if (currentNode) {
      if (!currentNode.left && !currentNode.right) {
        parent[parentDirection] = null;
      } else if (
        (currentNode.left && !currentNode.right) ||
        (!currentNode.left && currentNode.right)
      ) {
        const childDirection = currentNode.left !== null ? 'left' : 'right';
        parent[parentDirection] = currentNode[childDirection];
      } else {
        const [leftNullNode, leftNullNodePar] = this.traverseLeft(
          currentNode.right
        );
        if (leftNullNode.right) {
          leftNullNodePar.left = leftNullNode.right;
          currentNode.data = leftNullNode.data;
        } else {
          leftNullNodePar.left = null;
          currentNode.data = leftNullNode.data;
        }
      }
    }
  }

  traverse(
    value,
    currentNode,
    parent = null,
    parentDirection = null,
    depth = 0
  ) {
    if (!currentNode) {
      return [null, parent, parentDirection];
    }
    if (value > currentNode.data) {
      return this.traverse(
        value,
        currentNode.right,
        currentNode,
        (parentDirection = 'right'),
        depth + 1
      );
    } else if (value < currentNode.data) {
      return this.traverse(
        value,
        currentNode.left,
        currentNode,
        (parentDirection = 'left'),
        depth + 1
      );
    } else {
      // value === currentNode.data
      return [currentNode, parent, parentDirection, depth];
    }
  }

  traverseLeft(currentNode, parent = null) {
    if (!currentNode.left) {
      return [currentNode, parent];
    }
    return this.traverseLeft(currentNode.left, currentNode);
  }

  returnData(outputArr = [], node = null) {
    outputArr.push(node.data);
  }

  levelOrder(callback, node = this.root) {
    try {
      if (!callback || typeof callback !== 'function') {
        callback = this.returnData;
        throw new Error('No callback provided. Using returnData as default.');
      }
    } catch (error) {
      console.log(error);
    }

    if (!node) return;
    let queue = [node];
    let output = [];
    let current = node;
    while (current && queue.length) {
      callback(output, current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
      queue.splice(0, 1);
      current = queue[0];
    }
    return output;
  }

  preOrder(callback, currentNode = this.root, output = []) {
    try {
      if (!callback || typeof callback !== 'function') {
        callback = this.returnData;
        throw new Error('No callback provided. Using returnData as default.');
      }
    } catch (error) {
      console.log(error);
    }

    if (!currentNode) {
      return output;
    }
    callback(output, currentNode);
    this.preOrder(callback, currentNode.left, output);
    this.preOrder(callback, currentNode.right, output);
    return output;
  }

  inOrder(callback, currentNode = this.root, output = []) {
    try {
      if (!callback || typeof callback !== 'function') {
        callback = this.returnData;
        throw new Error('No callback provided. Using returnData as default.');
      }
    } catch (error) {
      console.log(error);
    }

    if (!currentNode) {
      return output;
    }
    this.inOrder(callback, currentNode.left, output);
    callback(output, currentNode);
    this.inOrder(callback, currentNode.right, output);
    return output;
  }

  postOrder(callback, currentNode = this.root, output = []) {
    try {
      if (!callback || typeof callback !== 'function') {
        callback = this.returnData;
        throw new Error('No callback provided. Using returnData as default.');
      }
    } catch (error) {
      console.log(error);
    }

    if (!currentNode) {
      return output;
    }
    this.postOrder(callback, currentNode.left, output);
    this.postOrder(callback, currentNode.right, output);
    callback(output, currentNode);
    return output;
  }

  height(node) {
    if (typeof node !== 'object') {
      const nodeFromValue = this.find(node);
      node = nodeFromValue;
    }
    if (!node) return -1;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    if (typeof node !== 'object') {
      const [, depthFromValue] = this.find(node, 'depth');
      return depthFromValue;
    }

    const [, depth] = this.find(node.data, 'depth');
    return depth;
  }

  isBalanced() {
    const lvOrderLeft = this.levelOrder(this.returnData, this.root.left);
    const leftSubDepth = this.depth(lvOrderLeft.at(-1));
    const lvOrderRight = this.levelOrder(this.returnData, this.root.right);
    const rightSubDepth = this.depth(lvOrderRight.at(-1));

    if (leftSubDepth - rightSubDepth > 1 || leftSubDepth - rightSubDepth < -1)
      return false;

    return true;
  }

  rebalance() {
    if (!this.isBalanced()) {
      const inOrderValues = this.inOrder(this.returnData);
      this.root = this.buildTree(inOrderValues);
    }
  }
}

export default Tree;
