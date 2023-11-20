import { rule } from '../common';

export default rule({
  create(context, optionsWithDefault) {
    return {
      TSTypeAnnotation(node) {
        // console.log(node);
      },
    };
  },

  name: 'any',
  meta: {
    type: 'suggestion',
    messages: {},
    schema: [],
    docs: { description: 'Checks for the use of the type `any`.' },
  },

  defaultOptions: [],
});
