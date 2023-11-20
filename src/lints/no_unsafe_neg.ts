import { Category, Level, Lint, Meta } from '../lint';

export class NonUnsafeNeg extends Lint {
  public meta: Meta = {
    category: Category.Correctness,
    level: Level.Warn,
    name: 'no_unsafe_neg',
    description: '',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isPrefixUnaryExpression(t)) {
        if (t.operator === this.ts.SyntaxKind.MinusToken) {
          const ty = this.ty_of(t.operand);

          if (!this.has_ty_flag(ty, this.ts.TypeFlags.NumberLike)) {
            this.report(t);
          } else {
            this.skip(t);
          }
        }
      }
    }
  }
}
