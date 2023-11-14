import * as ts from 'byots';
import { Category, Level, Lint, Meta } from '../lint';
import { is_type_flag_set } from '../tools';

export class ObjectEq extends Lint {
  public meta: Meta = {
    category: Category.Suspicious,
    level: Level.Deny,
    name: 'object_eq',
    description: 'Checks for comparisons between `object` types.',
  };

  public check() {
    for (const t of this.children()) {
      if (ts.isBinaryExpression(t)) {
        if (ts.isEqualityOperatorKind(t.operatorToken.kind)) {
          const l_ty = this.typeck().getTypeAtLocation(t.left);
          const r_ty = this.typeck().getTypeAtLocation(t.right);

          if (
            is_type_flag_set(l_ty, ts.TypeFlags.Object) ||
            is_type_flag_set(r_ty, ts.TypeFlags.Object)
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
