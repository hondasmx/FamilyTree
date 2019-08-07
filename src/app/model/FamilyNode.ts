import LineCoordinates from "./LineCoordinates";
import SimpleCoordinates from "./SimpleCoordinates";

class FamilyNode {
  public get siblings(): Set<FamilyNode> {
    return this._siblings;
  }

  public get partner(): FamilyNode {
    return this._partner;
  }

  public set partner( value: FamilyNode ) {
    this._partner = value;
  }

  private _name: string = "Unnamed";
  private _siblings: Set<FamilyNode> = new Set<FamilyNode>();
  public x: number = 0;
  public y: number = 0;
  private _level: number = 1;
  private _parents: Set<FamilyNode> = new Set<FamilyNode>();
  private _children: Set<FamilyNode> = new Set<FamilyNode>();
  private _partner: FamilyNode;

  constructor() {
    return this;
  }

  /**
   * true for partners
   * false for brothers
   * @param {boolean} partner
   * @return {LineCoordinates}
   */
  public outLine( partner: boolean ): LineCoordinates {
    let center = this.centerLinkCoordinates();
    let constant = partner ? defaultHeight : -defaultHeight;
    return {
      x1: center.x,
      y1: center.y,
      x2: center.x,
      y2: center.y + constant,
    }
  }

  private brotherOrPartnerLines(partner: boolean): LineCoordinates[] {
    let result: LineCoordinates[] = [];
    let thisOutline = this.outLine(partner);
    result.push(thisOutline);
    const centerPoint = this.centerPoint(partner);
    result.push({
      x1: thisOutline.x2,
      y1: thisOutline.y2,
      x2: thisOutline.x2,
      y2: centerPoint.y,
    });
    result.push({
      x1: thisOutline.x2,
      y1: centerPoint.y,
      x2: centerPoint.x,
      y2: centerPoint.y,
    });
    return result;
  }

  /**
   * true for partner
   * false for partners
   * @param {boolean} partner
   * @return {SimpleCoordinates}
   */
  private centerPoint( partner: boolean ): SimpleCoordinates {
    let thisOutline = this.outLine(partner);
    const size = this.siblings.size + 1;
    let x = thisOutline.x2;
    let y = thisOutline.y2;
    if (partner) {
      let siblingOutline = this.partner.outLine(partner);
      x += siblingOutline.x2;
      y = Math.max(siblingOutline.y2, y);
      x = x / 2;
    } else {
      this.siblings.forEach(( sibling: FamilyNode ) => {
        let siblingOutline = sibling.outLine(partner);
        x += siblingOutline.x2;
        y = Math.min(siblingOutline.y2, y);
      });
      x = x / size;
    }

    return {
      x: x,
      y: y,
    };
  }

  public allLines(): LineCoordinates[] {
    let result: LineCoordinates[] = [];
    if (this.partner) {
      result.push(...this.brotherOrPartnerLines(true));
    }
    if (this.siblings.size > 0) {
      result.push(...this.brotherOrPartnerLines(false));
    }
    if (this.parents.size > 0) {
      const siblingCenterPoint: SimpleCoordinates = this.centerPoint(false);
      const parentCenterPoint: SimpleCoordinates = this.parents.values().next().value.centerPoint(true)
      result.push({
        x1: siblingCenterPoint.x,
        y1: siblingCenterPoint.y,
        x2: siblingCenterPoint.x,
        y2: parentCenterPoint.y,
      });
      result.push({
        x1: siblingCenterPoint.x,
        y1: parentCenterPoint.y,
        x2: parentCenterPoint.x,
        y2: parentCenterPoint.y
      })
    }
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

  public withPartner( node: FamilyNode ): this {
    this.partner = node;
    if (!node.partner) {
      node.withPartner(this);
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
