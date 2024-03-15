import React from 'react';

const Loading = () => {
  return (
    <div className="grow">
      <div className="p-6 w-full">
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="w-full h-10 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
          <div className="w-2/3 h-8 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
          <div className="w-10/12 h-8 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-2 animate-pulse mt-10">
          <div className="w-full h-10 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
          <div className="w-2/3 h-8 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
          <div className="w-10/12 h-8 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
        </div>
        
        <div className="flex flex-col gap-2 animate-pulse mt-10">
          <div className="w-full h-10 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
          <div className="w-2/3 h-8 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
          <div className="w-10/12 h-8 bg-gray-300 dark:bg-slate-900 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
export default Loading;