import LineCoordinates from "./LineCoordinates";
import SimpleCoordinates from "./SimpleCoordinates";

class FamilyNode {
  public get siblings(): Set<FamilyNode> {
    return this._siblings;
  }

  public get spouse(): FamilyNode {
    return this._spouse;
  }

  public set spouse( value: FamilyNode ) {
    this._spouse = value;
  }

  private _name: string = "Unnamed";
  private _siblings: Set<FamilyNode> = new Set<FamilyNode>();
  public x: number = 0;
  public y: number = 0;
  private _level: number = 1;
  private _parents: Set<FamilyNode> = new Set<FamilyNode>();
  private _children: Set<FamilyNode> = new Set<FamilyNode>();
  private _spouse: FamilyNode;

  constructor() {
    return this;
  }

  public outLine( down: boolean ): LineCoordinates {
    let center = this.centerLinkCoordinates();
    let constant = down ? defaultHeight : -defaultHeight;
    return {
      x1: center.x,
      y1: center.y,
      x2: center.x,
      y2: center.y + constant,
    }
  }

  private brotherLines(): LineCoordinates[] {
    let result: LineCoordinates[] = [];
    const size = this.siblings.size + 1;
    if (size == 1) return result;

    let thisOutline = this.outLine(false);
    result.push(thisOutline);
    const brotherCenterPoint = this.brotherCenterPoint();
    result.push({
      x1: thisOutline.x2,
      y1: thisOutline.y2,
      x2: thisOutline.x2,
      y2: brotherCenterPoint.y,
    });
    result.push({
      x1: thisOutline.x2,
      y1: brotherCenterPoint.y,
      x2: brotherCenterPoint.x,
      y2: brotherCenterPoint.y
    });
    return result;
  }

  private brotherCenterPoint(): SimpleCoordinates {
    let thisOutline = this.outLine(false);
    const size = this.siblings.size + 1;
    let x = thisOutline.x2;
    let y = thisOutline.y2;
    this.siblings.forEach(( sibling: FamilyNode ) => {
      let siblingOutline = sibling.outLine(false);
      x += siblingOutline.x2;
      y = Math.min(siblingOutline.y2, y);
    });

    return {
      x: x / size,
      y: y,
    };
  }
  public allLines(): LineCoordinates[] {
    let result: LineCoordinates[] = [];
    if (this.spouse) {
      result.push(...this.spouseLines());
    }
    if (this.siblings.size > 0) {
      result.push(...this.brotherLines());
    }
    if (this.parents.size > 0) {
      result.push({
        x1: this.spouseCenterPoint().x,
        y1: this.spouseCenterPoint().y,
        x2: this.brotherCenterPoint().x,
        y2: this.brotherCenterPoint().y,
      });
    }
    return result;
  }



  private spouseCenterPoint(): SimpleCoordinates {
    if (!this.spouse) {
      return {
        x: this.x,
        y: this.y,
      }
    }
    const spouseDownLine = this.spouse.outLine(true);
    const downLine = this.outLine(true);
    return {
      x: (spouseDownLine.x2 + downLine.x2) / 2,
      y: (spouseDownLine.y2 + downLine.y2) / 2,
    }
  }



  private spouseLines(): LineCoordinates[] {
    let result: LineCoordinates[] = [];
    if (!this.spouse) return result;
    let downLine = this.outLine(true);
    result.push(downLine);
    result.push({
      x1: downLine.x2,
      y1: downLine.y2,
      x2: this.spouseCenterPoint().x,
      y2: this.spouseCenterPoint().y,
    });
    return result;
  }

  public nodeCoordinates = (): SimpleCoordinates => ({
    x: this.x,
    y: this.y,
  });

  public textCoordinates = (): SimpleCoordinates => ({
    x: this.nodeCoordinates().x + 5,
    y: this.nodeCoordinates().y + 5,
  });

  public rightLinkCoordinates = (): SimpleCoordinates => ({
    x: this.nodeCoordinates().x + defaultWidth,
    y: this.nodeCoordinates().y + defaultHeight / 2,
  });

  public leftLinkCoordinates = (): SimpleCoordinates => ({
    x: this.nodeCoordinates().x,
    y: this.nodeCoordinates().y + defaultHeight / 2,
  });

  public centerLinkCoordinates = (): SimpleCoordinates => ({
    x: this.nodeCoordinates().x + defaultWidth / 2,
    y: this.nodeCoordinates().y + defaultHeight / 2,
  });

  public set level( value: number ) {
    this._level = value;
  }

  public get level(): number {
    return this._level;
  }

  public get parents(): Set<FamilyNode> {
    return this._parents;
  }

  public get children(): Set<FamilyNode> {
    return this._children;
  }

  public get name(): string {
    return this._name;
  }

  public withName( name: string ): this {
    this._name = name;
    return this;
  }

  public withParent( parent: FamilyNode|undefined ): this {
    if (!parent) return this;

    parent.level = this.level + 1;
    this._parents.add(parent);
    return this;
  }

  public withChild( child: FamilyNode ): this {
    child.withParent(this);
    this.level = child.level + 1;
    this._children.add(child);
    return this;
  }

  public withSpouse( node: FamilyNode ): this {
    this.spouse = node;
    if (!node.spouse) {
      node.withSpouse(this);
    }
    return this;
  }

  public withSibling( node: FamilyNode ): this {
    this.siblings.add(node);
    if (!node.siblings.has(this)) {
      node.siblings.add(this);
    }
    for (let sibling of node.siblings) {
      if (!this.siblings.has(sibling) && this != sibling) {
        this.withSibling(sibling)
      }
    }
    return this;
  }

  public withChildren( children: FamilyNode[] ): this {
    for (const child of children) {
      this._children.add(child);
    }
    return this;
  }
}

const defaultWidth: number = 15;
const defaultHeight: number = 10;



export default FamilyNode;
