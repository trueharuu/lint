import { Any } from './any';
import { BoxedTypes } from './boxed_types';
import { Eval } from './eval';
import { NonAsciiIdent } from './non_ascii_ident';
import { NonBoolCondition } from './non_bool_condition';
import { ObjectEq } from './object_eq';
import { Statement } from './statement';
import { UselessNullAssert } from './useless_null_assert';

export const lints = [
  Any,
  Statement,
  NonAsciiIdent,
  ObjectEq,
  NonBoolCondition,
  UselessNullAssert,
  Eval,
  BoxedTypes,
];
