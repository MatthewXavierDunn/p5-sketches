p5.disableFriendlyErrors = true;

const SCALE = 0.5;
const ANGLE = 0.1;
const STEP = 5 * SCALE;
const WIDTH = Math.round(1920 * SCALE);
const HEIGHT = Math.round(1080 * SCALE);
const START_POS = [WIDTH * (1/3), HEIGHT / 12];
const START_THETA = Math.PI / 2;
const UPTO = 1e+7; //1e+7

var shapeStarted = false;

class Node {

  constructor(val, left=null, right=null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }

  toString() {
    return `${this.val} : (${this.left}, ${this.right})`;
  }

  draw(origin, theta, isEven=false) {
            
    if (!shapeStarted) {
      beginShape();
      shapeStarted = true;
      vertex(origin[0], origin[1]);
    }
    
    let mTheta = theta + (isEven ? 1: -1) * ANGLE;
    
    let mOrigin = [origin[0] + STEP * cos(mTheta),
                  origin[1] + STEP * sin(mTheta)];
    
    vertex(mOrigin[0], mOrigin[1]);
        
    if (this.left) {
      this.left.draw(mOrigin, mTheta, true);
    }
    
    if (this.right) {
      this.right.draw(mOrigin, mTheta, false);
    }

    let hasNoChildren = this.left === null && this.right === null;
    if (hasNoChildren) {
      endShape();
      shapeStarted = false;
    }
  }
}

function collatzTree(upTo) {
  const nodes = new Map();

  for (let i = 1; i < upTo; i++) {
    
    let n = i;
    if (nodes.has(n)) continue;
    
    let currentNode = new Node(n);
    nodes.set(n, currentNode);

    while (n != 1) {
      
      let isEven = n % 2 == 0;
      let nextN = isEven ? n / 2 : (3 * n + 1) / 2;
      
      if (nodes.has(nextN)) {
        
        if (isEven) {
          nodes.get(nextN).left = currentNode;
        } else {
          nodes.get(nextN).right = currentNode;
        }
        break;
      }
      
      currentNode = isEven ?
        new Node(nextN, currentNode) :
        new Node(nextN, null, currentNode);
      
      nodes.set(nextN, currentNode);
      n = nextN;
    }
  }

  return nodes;
}

var nodes;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  // background(0);

  noFill();
  strokeWeight(1);
  stroke(255, 100);

  nodes = collatzTree(UPTO);
  nodes.get(1).draw(START_POS, START_THETA);
  print(`#${nodes.size} Nodes in ${millis() / 1000}s`);
}