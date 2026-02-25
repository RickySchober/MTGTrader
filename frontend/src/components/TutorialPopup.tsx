import React from "react";

import Button from "./Button.js";

import { useLocalStorageState } from "@/lib/hooks.js";
interface TutorialPage {
  image: string;
  title: string;
  body: string;
}

interface MultiTutorialPopupProps {
  pages: TutorialPage[];
  keyName: string;
}

const MultiTutorialPopup: React.FC<MultiTutorialPopupProps> = ({ pages, keyName }) => {
  const [index, setIndex] = React.useState(0);
  const [disableTutor, setDisableTutor] = useLocalStorageState(keyName);
  const [showTutor, setShowTutor] = React.useState<boolean>(!disableTutor);
  const isLast = index === pages.length - 1;
  const isFirst = index === 0;

  const page = pages[index];

  return (
    showTutor && (
      <div className="bg-slate-dark/60 fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-slate border-slate-light relative w-[65%] rounded-xl border-2 p-6">
          <h2 className="text-primary pb-2 text-4xl font-bold">{page.title}</h2>
          {page.image && (
            <img src={page.image} className="border-slate-light mb-4 w-full rounded-md border-2" />
          )}
          <p className="mb-2 text-xl font-semibold leading-relaxed">{page.body}</p>

          <div className="mt-2 flex justify-between">
            <Button
              disabled={isFirst}
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              className={
                !isFirst
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-transparent text-transparent hover:bg-transparent"
              }
            >
              Back
            </Button>
            {/* PAGE DOTS */}
            <div className="my-3 flex justify-center gap-2">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition ${
                    i === index ? "bg-primary" : "bg-slate-light"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (isLast) setShowTutor(false);
                else setIndex((i) => i + 1);
              }}
            >
              {isLast ? "Finish" : "Next"}
            </Button>
          </div>
          <Button
            onClick={() => {
              setDisableTutor(true);
              setShowTutor(false);
            }}
            className="mt-2 w-full bg-transparent text-center text-gray-400 underline hover:bg-transparent"
          >
            Don’t show this tutorial again
          </Button>
        </div>
      </div>
    )
  );
};

export default MultiTutorialPopup;
