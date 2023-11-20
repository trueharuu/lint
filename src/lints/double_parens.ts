import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class DoubleParens extends Lint {
  public meta: Meta = {
    category: Category.Complexity,
    level: Level.Warn,
    name: 'double_parens',
    description: 'Checks for unnecessary double parentheses.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isParenthesizedExpression(t)) {
        if (this.ts.isParenthesizedExpression(t.expression)) {
          this.report(t);
        } else {
          this.skip(t);
        }
      }
    }
  }

  public fixes(_: Node) {
    if (this.ts.isParenthesizedExpression(_)) {
      this.fix('remove the extra parentheses', _.expression);
    }
  }
}
