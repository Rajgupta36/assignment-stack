import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen mx-32 my-10 bg-background dark:bg-background text-black  dark:text-secondary p-6">
      <header className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-4xl font-bold">Hello user,</h1>
        <p className="text-xl ">How are you doing today?</p>
      </header>
    </div>
  );
};

export default Dashboard;
