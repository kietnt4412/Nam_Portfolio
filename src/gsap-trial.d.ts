declare module 'gsap/SplitText' {
  export class SplitText {
    constructor(target: any, vars?: any);
    chars: HTMLElement[];
    lines: HTMLElement[];
    words: HTMLElement[];
    revert(): void;
  }
}

declare module 'gsap/ScrollSmoother' {
  export class ScrollSmoother {
    static create(vars?: any): ScrollSmoother;
    static refresh(safe?: boolean): void;
    scrollTop(value?: number): number;
    scrollTo(target: any, smooth?: boolean, position?: string): void;
    paused(value?: boolean): boolean;
    kill(): void;
  }
}
