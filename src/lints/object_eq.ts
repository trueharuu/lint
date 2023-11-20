import { Category, Level, Lint, Meta } from '../lint';

export class ObjectEq extends Lint {
  public meta: Meta = {
    category: Category.Suspicious,
    level: Level.Deny,
    name: 'object_eq',
    description: 'Checks for comparisons between `object` types.',
  };

  public check() {
    for (const t of this.children()) {
      if (this.ts.isBinaryExpression(t)) {
        if (this.ts.isEqualityOperatorKind(t.operatorToken.kind)) {
          const l_ty = this.ty_of(t.left);
          const r_ty = this.ty_of(t.right);

          if (
            this.has_ty_flag(l_ty, this.ts.TypeFlags.Object) ||
            this.has_ty_flag(r_ty, this.ts.TypeFlags.Object)
          ) {
            this.report(t);
          } else {
            this.skip(t);
          }
        }
      }
    }
  }
}
