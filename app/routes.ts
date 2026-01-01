import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('api/chat', 'routes/api.chat.ts'),
  route('api/enhancer', 'routes/api.enhancer.ts'),
  route('chat/:id', 'routes/chat.$id.tsx'),
] satisfies RouteConfig;
