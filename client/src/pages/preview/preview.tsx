import React from "react";
import { useParams } from "react-router"

import { dummyResumeData } from "../../mocks/resume-data";
import type { IResume } from "../../types/types";
import ResumePreview from "../../components/organisms/resume/resume-preview";
import Loader from "../../components/atoms/loader";
import { ArrowLeftIcon } from "lucide-react";

function Preview() {
  const [isLoading, setIsLoading] = React.useState(true);
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resumeData, setResumeData] = React.useState<IResume | null>(null);

  function loadResume() {
    setResumeData(dummyResumeData.find(r => r._id === resumeId) || null);
    setIsLoading(false);
  }
    
  React.useEffect(() => {
    loadResume();
  }, [resumeId]);
  
  console.log('resumeData: ', resumeData)

  return (
    <>
      {resumeData ? (
        <div className="bg-slate-100">
          <div className="max-w-3xl mx-auto py-10">
            <ResumePreview 
              classes='py-4 bg-white'
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex flex-col items-center justify-center h-screen">
              <p className="text-center text-6xl text-slate-400 font-medium">Resume not found.</p>
              <a href="/" className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors">
                <ArrowLeftIcon className="mr-2 size-4" /> go to home page
              </a>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Preview