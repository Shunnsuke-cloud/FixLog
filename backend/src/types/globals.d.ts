declare const process: {
  env: Record<string, string | undefined>;
};

declare module 'express' {
  const express: any;
  export default express;
  export const Router: any;
}

declare module 'cors' {
  const cors: any;
  export default cors;
}

declare module 'helmet' {
  const helmet: any;
  export default helmet;
}

declare module 'morgan' {
  const morgan: any;
  export default morgan;
}
