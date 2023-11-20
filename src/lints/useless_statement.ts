import { Node, ExpressionStatement } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';

export class UselessStatement extends Lint {
  public meta: Meta = {
    category: Category.Complexity,
    level: Level.Warn,
    name: 'useless_statement',
    description: 'Checks for statements with no effects.',
  };

  public can_have_effects(t: Node): boolean {
    if (this.ts.isExpressionStatement(t) || this.ts.isExpression(t)) {
      const u = (t as ExpressionStatement).expression || t;
      if (this.ts.isLiteralExpression(u)) {
        return false;
      }

      if (this.ts.isBinaryExpression(u)) {
        return this.can_have_effects(u.left) || this.can_have_effects(u.right);
      }
    }

    if (this.ts.isIfStatement(t)) {
      if (t.elseStatement !== undefined) {
        return this.can_have_effects(t.elseStatement);
      }
      return (
        this.can_have_effects(t.expression) ||
        this.can_have_effects(t.thenStatement)
      );
    }

    if (this.ts.isBlock(t)) {
      for (const s of t.statements) {
        if (this.can_have_effects(s)) {
          return true;
        }
      }
    }

    return true;
  }

  public check() {
    for (const t of this.children()) {
      if (this.ts.isStatement(t))
        if (!this.can_have_effects(t)) {
          this.report(t);
        }
    }
  }

  public fixes() {
    this.fix('remove the expression', '');
  }
}
