// Allow importing plain CSS/SCSS files (global side-effect imports)
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// For CSS Modules (if used elsewhere)
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
