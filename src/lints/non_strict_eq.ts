import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';
import { color } from '../tools';

export class NonStrictEq extends Lint {
  public meta: Meta = {
    category: Category.Correctness,
    level: Level.Deny,
    name: 'non_strict_eq',
    description:
      'Checks for non-strict equality comparisons using `==` or `!=`.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isBinaryExpression(t)) {
        if (
          t.operatorToken.kind === this.ts.SyntaxKind.EqualsEqualsToken ||
          t.operatorToken.kind === this.ts.SyntaxKind.ExclamationEqualsToken
        ) {
          this.report(t.operatorToken);
        } else {
          this.skip(t.operatorToken);
        }
      }
    }
  }

  public fixes(t: Node): void {
    if (t.kind === this.ts.SyntaxKind.EqualsEqualsToken) {
      this.fix(
        `use the ${color('`===`', 34)} comparison instead`,
        this.factory().createToken(this.ts.SyntaxKind.EqualsEqualsEqualsToken),
      );
    } else if (t.kind === this.ts.SyntaxKind.ExclamationEqualsToken) {
      this.fix(
        `use the ${color('`!==`', 34)} comparison instead`,
        this.factory().createToken(
          this.ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ),
      );
    }
  }
}
