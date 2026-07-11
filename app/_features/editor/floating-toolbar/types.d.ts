export type ElementType = "span" | "div" | "button" | "input" | "img" | "";

export type Element = { name: string; icon: React.ComponentType<any>; type: ElementType; classes: string };
