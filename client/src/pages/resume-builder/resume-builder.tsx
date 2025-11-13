import React from 'react'
import { Link, useParams } from 'react-router';
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react';

import type { IPersonalInfo, IResume } from '../../types/types';
import { dummyResumeData } from '../../mocks/resume-data';
import { PATH } from '../../configs/path';
import PersonalInfo from '../../components/organisms/resume/personal-info';
import ResumePreview from '../../components/organisms/resume/resume-preview';
import TemplateSelector from '../../components/organisms/resume/template-selector';
import ColorPicker from '../../components/organisms/resume/color-picker';
import ProfessionalSummary from '../../components/organisms/resume/professional-summary';
import ExperienceInfo from '../../components/organisms/resume/experience-info';
import EducationInfo from '../../components/organisms/resume/education-info';
import ProjectInfo from '../../components/organisms/resume/project-info';
import SkillInfo from '../../components/organisms/resume/skill-info';

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

  function changeResumeVisibility() {
    setResumeData(prevState => ({...prevState, public: !prevState.public }));
  }

  function handleShare() {
    const url = window.location.href.split('/app/')[0];
    const resumeUrl = `${url}/view/${resumeId}`;

    // copy link to clipboard
    navigator.clipboard.writeText(resumeUrl);

    if(navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: 'My Resume',
      })
    } else {
      alert('Share not supported in this browser. Copy the link: ' + resumeUrl);
    }
  }

  function downloadResume() {
    window.print();
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
          <div className='relative lg:col-span-5 rounded-lg'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              <hr 
                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-200'
                style={{
                  width: `${activeSectionIndex * 100 / (sections.length - 1)}%`,
                }}
              />

              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector 
                    selectedTemplate={resumeData.template}
                    onChange={tempalte => setResumeData(prev => ({ ...prev, template : tempalte }))}
                  />

                  <ColorPicker 
                    selectedColor={resumeData.accent_color}
                    onChange={color => setResumeData(prev => ({ ...prev, accent_color : color }))}
                  />
                </div>
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

                {activeSection.id === 'summary' && (
                  <ProfessionalSummary 
                    data={resumeData.professional_summary || ''}
                    onChange={(value: string) => setResumeData(prevState => ({...prevState, professional_summary: value }))}
                  />
                )}

                {activeSection.id === 'experience' && (
                 <ExperienceInfo 
                    data={resumeData.experience || []}
                    onChange={(data) => setResumeData(prevState => ({...prevState, experience: data }))}
                 />
                )}

                {activeSection.id === 'education' && (
                 <EducationInfo 
                    data={resumeData.education || []}
                    onChange={(data) => setResumeData(prevState => ({...prevState, education: data }))}
                 />
                )}

                {activeSection.id === 'projects' && (
                 <ProjectInfo 
                    data={resumeData.project || []}
                    onChange={(data) => setResumeData(prevState => ({...prevState, project: data }))}
                 />
                )}

                {activeSection.id === 'skills' && (
                 <SkillInfo 
                    data={resumeData.skills || []}
                    onChange={(data) => setResumeData(prevState => ({...prevState, skills: data }))}
                 />
                )}
              </div>

              <div className="text-right">
                <button className='bg-gradient-to-br from-blue-100 to-blue-200 ring-blue-300 text-blue-600 ring hover:ring-blue-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className='lg:col-span-7 max-lg:mt-6'>
              <div className='relative w-full'>
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                  {resumeData.public && (
                    <button
                      className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'
                      onClick={handleShare}
                    >
                      <Share2Icon className='size-4'/>
                    </button>
                  )}

                  <button
                    className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'
                    onClick={changeResumeVisibility}
                  >
                    {resumeData.public ? (
                      <>
                        <EyeIcon className='size-4'/> Public
                      </>
                    ) : (
                      <>
                        <EyeOffIcon className='size-4'/> Private
                      </>
                    )}
                  </button>

                  <button
                    className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'
                    onClick={downloadResume}
                  >
                    <DownloadIcon className='size-4'/> Download
                  </button>
                </div>
              </div>
              <ResumePreview 
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
          </div>
        </div>
      </div>
    </>
  )
}

export default ResumeBuilder