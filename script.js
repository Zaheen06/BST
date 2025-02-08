class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

let root = null;
let canvas = document.getElementById('treeCanvas');
let ctx = canvas.getContext('2d');
const nodeRadius = 20;
let isBST = true;

function initCanvas() {
    canvas.width = Math.max(window.innerWidth - 100, 300);
    canvas.height = 400;
    drawTree();
}

window.addEventListener('resize', initCanvas);
initCanvas();

document.getElementById('treeType').addEventListener('change', function (e) {
    isBST = e.target.value === 'bst';
});

function addNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    if (containsValue(root, value)) {
        alert('Duplicate values are not allowed!');
        return;
    }

    if (!root) {
        root = new Node(value);
    } else {
        if (isBST) {
            insertBST(root, value);
        } else {
            insertBT(root, value);
        }
    }

    document.getElementById('nodeValue').value = '';
    updateTraversals();
    drawTree();
}

function insertBST(node, value) {
    if (value < node.value) {
        if (node.left === null) {
            node.left = new Node(value);
        } else {
            insertBST(node.left, value);
        }
    } else {
        if (node.right === null) {
            node.right = new Node(value);
        } else {
            insertBST(node.right, value);
        }
    }
}

function insertBT(node, value) {
    if (Math.random() < 0.5) {
        if (node.left === null) {
            node.left = new Node(value);
        } else {
            insertBT(node.left, value);
        }
    } else {
        if (node.right === null) {
            node.right = new Node(value);
        } else {
            insertBT(node.right, value);
        }
    }
}

// Helper function to check if a value exists in the tree
function containsValue(node, value) {
    if (!node) return false;
    if (node.value === value) return true;
    return containsValue(node.left, value) || containsValue(node.right, value);
}

function clearTree() {
    root = null;
    updateTraversals();
    drawTree();
}

function calculatePositions(node, level = 0, position = 0, positions = new Map()) {
    if (!node) return;

    const key = `${level}-${position}`;
    const spacing = canvas.width / Math.pow(2, level + 1);

    node.x = spacing + position * spacing * 2;
    node.y = level * 70 + 50;

    positions.set(key, node);

    calculatePositions(node.left, level + 1, position * 2, positions);
    calculatePositions(node.right, level + 1, position * 2 + 1, positions);
}

function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!root) return;

    calculatePositions(root);
    drawNode(root);
}

function drawNode(node) {
    if (!node) return;

    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.strokeStyle = '#666';
        ctx.stroke();
        drawNode(node.left);
    }

    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x, node.right.y);
        ctx.strokeStyle = '#666';
        ctx.stroke();
        drawNode(node.right);
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '14px Arial';
    ctx.fillText(node.value, node.x, node.y);
}

function updateTraversals() {
    document.getElementById('inorder').textContent = 'Inorder: ' + getInorder(root).join(' → ');
    document.getElementById('preorder').textContent = 'Preorder: ' + getPreorder(root).join(' → ');
    document.getElementById('postorder').textContent = 'Postorder: ' + getPostorder(root).join(' → ');
}

function getInorder(node) {
    if (!node) return [];
    return [...getInorder(node.left), node.value, ...getInorder(node.right)];
}

function getPreorder(node) {
    if (!node) return [];
    return [node.value, ...getPreorder(node.left), ...getPreorder(node.right)];
}

function getPostorder(node) {
    if (!node) return [];
    return [...getPostorder(node.left), ...getPostorder(node.right), node.value];
}