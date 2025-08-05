import { ReactNode } from 'react';

export function TypographyNavTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-center text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  );
}


export function TypographyH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-center h-full text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="scroll-m-20 text-center h-full text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-center h-full text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h3>
  );
}

export function TypographyH4({ children }: { children: ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-center h-full text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h4>
  );
}

