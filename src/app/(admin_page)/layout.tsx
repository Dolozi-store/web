import React, { PropsWithChildren } from 'react';

export default function LayoutDashBoardContainer({ children }: PropsWithChildren) {
  return (
    <div className="h-screen w-screen block relative bg-white text-gray-700">
      {children}
    </div>
  );
}
