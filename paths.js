// Node
const jsonData= require('./payload.json');
// const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');

class node {
   constructor(e) {
       this.isFolder = e.isFolder;
       this.name = e.name;
       this.childs = new Map();
   }
}

// make tree
function makeTree(paths) {
   const treeRoot = new node({isFolder: true, name: "*"});

   for (const path of paths) {
       let curPos = treeRoot;
       const parts = path.split("/");
       while (parts.length) {
           const curPart = parts.shift();
           let childNode = curPos.childs.get(curPart);
           if (!childNode) {
               childNode = new node({
                   isFolder: !!parts.length,
                   name: curPart,
               });
               curPos.childs.set(curPart, childNode)
           }
           curPos = childNode;
       }
   }

   return treeRoot;
}

// print ( recursive function to display the tree )
// this function shall be deleted after adding the view files 
function *print(node, offset = 0, prev = "") {

   const offsetStr = " ".repeat(offset);

   if (!node.isFolder) {
       yield `${offsetStr}${prev}${node.name}`;
       return;
   }
   if (node.childs.size === 1) {
       const child = node.childs.values().next().value;
       if (child.isFolder === true) {
           for (const childData of print(child, offset, `${prev}${node.name}/`)) {
               yield childData;
           }
           return;
       }
   }
   yield `${offsetStr}${prev}${node.name}`;
   for (const child of node.childs.values()) {
       for (const childData of print(child, offset + prev.length, "|---")) {
           yield childData;
       }
   }
}
// reading the json file and store paths in the paths arra y
paths = []

jsonData["blobs"].map((a ) =>  {
   paths.push( a.Key)
   
})

const tree = makeTree(paths);

// // Print the tree 
 for(const node of print(tree)) {
   console.log(node);
}


