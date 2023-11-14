import { Category, Level, Lint, Meta } from '../lint';

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
}
