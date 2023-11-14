import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class BoxedTypes extends Lint {
  public meta: Meta = {
    category: Category.Suspicious,
    level: Level.Warn,
    name: 'boxed_types',
    description:
      'Checks for the use of boxed types such as `String` or `Boolean`.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isTypeReferenceNode(t)) {
        if (
          [
            'String',
            'Boolean',
            'Number',
            'Symbol',
            'Object',
            'BigInt',
          ].includes(t.typeName.getText(this.ast))
        ) {
          this.report(t);
        }
      }
    }
  }

  public fix(t: Node): Node | null {
    if (this.ts.isTypeReferenceNode(t)) {
      const name = t.typeName.getText(this.ast);

      return this.ts.factory.createTypeReferenceNode(name.toLowerCase());
    }
    return null;
  }
}
