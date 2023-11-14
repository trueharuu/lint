import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class UselessNullAssert extends Lint {
  public meta: Meta = {
    category: Category.Complexity,
    level: Level.Warn,
    name: 'useless_null_assert',
    description: 'Checks for more than one null assertion in a row.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isNonNullExpression(t)) {
        if (this.ts.isNonNullExpression(t.expression)) {
          this.report(t);
        }
      }
    }
  }

  public fix(t: Node): Node | null {
    if (this.ts.isNonNullExpression(t)) {
      return t.expression;
    }
    return null;
  }
}
