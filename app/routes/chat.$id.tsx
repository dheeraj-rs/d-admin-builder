import { default as IndexRoute } from './_index';

export async function loader(args: any) {
  return { id: args.params.id };
}

export default IndexRoute;
