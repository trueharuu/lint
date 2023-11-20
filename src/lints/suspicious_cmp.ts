import { Category, Level, Lint, Meta } from '../lint';

export class SuspiciousCmp extends Lint {
  public meta: Meta = {
    category: Category.Suspicious,
    level: Level.Warn,
    name: 'suspicious_cmp',
    description: 'Checks for comparisons between non-number values.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isBinaryExpression(t)) {
        if (
          t.operatorToken.kind === this.ts.SyntaxKind.GreaterThanToken ||
          t.operatorToken.kind === this.ts.SyntaxKind.LessThanToken ||
          t.operatorToken.kind === this.ts.SyntaxKind.GreaterThanEqualsToken ||
          t.operatorToken.kind === this.ts.SyntaxKind.LessThanEqualsToken
        ) {
          const l_ty = this.ty_of(t.left);
          const r_ty = this.ty_of(t.right);

          if (
            this.has_ty_flag(l_ty, this.ts.TypeFlags.NumberLike) &&
            this.has_ty_flag(r_ty, this.ts.TypeFlags.NumberLike)
          ) {
            this.skip(t);
          } else {
            // ????????????
            const magic_sym_to_primitive = '__@toPrimitive@10';
            const has_tp_l = this.typeck()
              .getPropertiesOfType(l_ty)
              .some((x) => x.name === magic_sym_to_primitive);
            const has_tp_r = this.typeck()
              .getPropertiesOfType(r_ty)
              .some((x) => x.name === magic_sym_to_primitive);

            if (has_tp_l && has_tp_r) {
              this.skip(t);
            } else {
              this.report(t);
            }
          }
        }
      }
    }
  }
}
