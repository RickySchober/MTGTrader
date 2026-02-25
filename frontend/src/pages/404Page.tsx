import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-slate flex min-h-screen w-full flex-col">
      <div className="z-90 bg-slate fixed mt-20 flex h-full w-full flex-col items-center justify-center gap-8">
        <p className="text-6xl font-medium">404 Page Not Found</p>
        <p className="text-2xl font-medium">Invalid url, trade, or card ID</p>
      </div>
    </div>
  );
};
export default NotFoundPage;
