import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class Eval extends Lint {
  public meta: Meta = {
    category: Category.Restriction,
    level: Level.Deny,
    name: 'eval',
    description: 'Checks for the use of `eval`.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isCallExpression(t)) {
        if (
          this.ts.isIdentifier(t.expression) &&
          t.expression.text === 'eval'
        ) {
          this.report(t);
        }
      }
    }
  }

  public fixes(t: Node) {
    if (
      this.ts.isCallExpression(t) &&
      t.arguments.length === 1 &&
      t.arguments[0] !== undefined &&
      this.ts.isStringLiteral(t.arguments[0])
    ) {
      this.fix('use the passed expression instead', t.arguments[0].text);
    }
  }
}
