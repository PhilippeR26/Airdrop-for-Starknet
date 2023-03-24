'use client';

type Props={children:JSX.Element};

export default function ClientComponent({children}:Props) {
  return (
    <>
      {children}
    </>
  );
}