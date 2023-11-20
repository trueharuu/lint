import { Node } from 'byots';
import { Category, Level, Lint, Meta } from '../lint';
import { color } from '../tools';

export class NonAsciiIdent extends Lint {
  public meta: Meta = {
    category: Category.Restriction,
    level: Level.Warn,
    name: 'non_ascii_ident',
    description: 'Checks for variables that use non-ASCII characters.',
  };

  public check() {
    for (const child of this.children()) {
      if (!this.ts.isVariableDeclaration(child)) {
        continue;
      }

      let ident = child.name.getText(this.ast);

      for (const char of ident) {
        if ((char.codePointAt(0) || 0) > 255) {
          this.report(child.name);
        } else {
          this.skip(child.name);
        }
      }
    }
  }

  public fixes(_: Node) {
    if (this.ts.isBindingName(_)) {
      const i = _.getText(this.ast).replace(
        /[^\x00-\x7F]/g,
        (x) => '\\u' + x.codePointAt(0)!.toString(16).padStart(4, '0'),
      );
      this.fix(
        `use it's escaped variant ${color(`\`${i}\``, 34)} instead`,
        this.ts.factory.createIdentifier(
          _.getText(this.ast).replace(
            /[^\x00-\x7F]/g,
            (x) => '\\u' + x.codePointAt(0)!.toString(16).padStart(4, '0'),
          ),
        ),
      );
    }
  }
}
