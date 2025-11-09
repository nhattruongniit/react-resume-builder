import React from 'react'
import { Link, useParams } from 'react-router';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkles, User } from 'lucide-react';

import type { IPersonalInfo, IResume } from '../../types/types';
import { dummyResumeData } from '../../mocks/resume-data';
import { PATH } from '../../configs/path';
import PersonalInfo from './components/personal-info';

const sections = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Professional Summary', icon: FileText },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'projects', name: 'Projects', icon: FolderIcon },
  { id: 'skills', name: 'Skills', icon: Sparkles },
]

function ResumeBuilder() {
  const { resumeId } =  useParams();
  const [resumeData, setResumeData] = React.useState<IResume>({
    _id: '',
    title: '',
    personal_info: null,
    public: false,
    professional_summary: '',
    skills: [],
    experience: [],
    education: [],
    template: "classic",
    accent_color:  "#3B82F6",
    project: [],
    updatedAt: '',
    createdAt: '',
  });
  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [removeBackground, setRemoveBackground] = React.useState(false);

  const activeSection = sections[activeSectionIndex];

  React.useEffect(() => {
    loadExistingResume();
  }, []);

  function loadExistingResume() {
    const resume = dummyResumeData.find(r => r._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  }

  function toggleRemoveBackground() {
    setRemoveBackground(prevState => !prevState);
  }

  return (
    <>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={"/" + PATH.APP} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4' /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              <hr 
                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-200'
                style={{
                  width: `${activeSectionIndex * 100 / (sections.length - 1)}%`,
                }}
              />

              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div></div>
                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                      disabled={activeSectionIndex === 0}
                      onClick={() => setActiveSectionIndex(prevIndex => Math.max(prevIndex - 1, 0))}
                    >
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}

                  <button
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50 cursor-not-allowed'}`}
                    disabled={activeSectionIndex === 0}
                    onClick={() => setActiveSectionIndex(prevIndex => Math.min(prevIndex + 1, sections.length - 1))}
                  >
                    Next <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {activeSection.id === 'personal' && (
                  <PersonalInfo 
                    data={resumeData.personal_info}
                    onChange={(data: IPersonalInfo) => setResumeData(prevState => ({...prevState, personal_info: data }))}
                    removeBackground={removeBackground}
                    toggleRemoveBackground={toggleRemoveBackground}
                  />
                )}
              </div>

            </div>

          </div>

          <div></div>
        </div>
      </div>
    </>
  )
}

export default ResumeBuilder