// CSS Module declarations
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// Allow importing CSS files as side effects
declare module "*.css" {
  const content: any;
  export = content;
}