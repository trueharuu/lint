import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';
import { color } from '../tools';

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

  public fixes(_: Node) {
    if (this.ts.isTypeReferenceNode(_)) {
      const name = _.typeName.getText(this.ast);

      this.fix(
        `use the primitive type ${color(
          `\`${_.typeName.getText(this.ast).toLowerCase()}\``,
          34,
        )} instead`,
        this.ts.factory.createTypeReferenceNode(name.toLowerCase()),
      );
    }
    return [];
  }
}
