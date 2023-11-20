import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';
import { color } from '../tools';

export class Any extends Lint {
  public meta: Meta = {
    category: Category.Restriction,
    level: Level.Deny,
    name: 'any',
    description: 'Checks for the use of the type `any`.',
  };

  public check() {
    for (const t of this.children()) {
      if (t.kind === this.ts.SyntaxKind.AnyKeyword) {
        this.report(t);
      }
    }
  }

  public fixes(_: Node) {
    let infer = null;
    if (_.parent) {
      if (this.ts.isVariableDeclaration(_.parent)) {
        const value = _.parent.initializer;
        if (value) {
          const ty = this.typeck().getTypeAtLocation(value);
          const s = this.typeck().typeToString(ty);
          infer = [
            `if applicable, use the inferred type ${color(`\`${s}\``, '34')}`,
            this.ts.factory.createTypeReferenceNode(s),
          ];
        }
      }
      // console.log(print_node(_.parent, this.ast));
      // console.log(print(_.parent, this.ast));
    }
    if (infer !== null) {
      this.fix(infer[0] as string, infer[1] as never);
    }

    this.fix(
      `if applicable, use ${color(`\`unknown\``, '34')}`,
      this.ts.factory.createTypeReferenceNode('unknown'),
    );
    this.fix(
      `if applicable, use ${color(`\`never\``, '34')}`,
      this.ts.factory.createTypeReferenceNode('never'),
    );
  }
}
