import { Any } from './any';
import { BoxedTypes } from './boxed_types';
import { DoubleParens } from './double_parens';
import { ElseThenIf } from './else_then_if';
import { EmptyBlock } from './empty_block';
import { EmptyEnum } from './empty_enum';
import { Eval } from './eval';
import { ImpreciseFloat } from './imprecise_float';
import { NonUnsafeNeg } from './no_unsafe_neg';
import { NonAsciiIdent } from './non_ascii_ident';
import { NonBoolCondition } from './non_bool_condition';
import { NonStrictEq } from './non_strict_eq';
import { ObjectEq } from './object_eq';
import { Statement } from './statement';
import { SuspiciousCmp } from './suspicious_cmp';
import { UselessNullAssert } from './useless_null_assert';
import { UselessStatement } from './useless_statement';

export const lints = [
  Any,
  Statement,
  NonAsciiIdent,
  ObjectEq,
  NonBoolCondition,
  UselessNullAssert,
  Eval,
  BoxedTypes,
  ImpreciseFloat,
  SuspiciousCmp,
  NonUnsafeNeg,
  DoubleParens,
  EmptyEnum,
  EmptyBlock,
  ElseThenIf,
  UselessStatement,
  NonStrictEq,
];
