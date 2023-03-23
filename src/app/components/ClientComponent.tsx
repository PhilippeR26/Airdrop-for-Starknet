'use client';
import React from "react";

type Props={children:JSX.Element};

export default function ClientComponent({children}:Props) {
  return (
    <>
      {children}
    </>
  );
}