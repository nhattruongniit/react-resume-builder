import React from "react";
import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { useSelector } from "react-redux";

import { dummyResumeData } from "../../mocks/resume-data";
import type { IResume } from "../../types/types";
import { COLORS } from "../../configs/colors";
import { PATH } from "../../configs/path";
import type { RootState } from "../../store";
import api from "../../services/api";

function Dashboard() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [allResumes, setAllResumes] = React.useState<IResume[]>([]);
  const [showCreateResume, setShowCreateResume] = React.useState<boolean>(false);
  const [showUploadResume, setShowUploadResume] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [resume, setResume] = React.useState<any>(null);
  const [editResumeId, setEditResumeId] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function loadAllResumes() {
      try {
        const { data: { resumes } } = await api.get('/api/resumes');
        setAllResumes([...dummyResumeData, ...resumes])
      } catch (error) {
        toast.error('Failed to load resumes. Please try again.');
      }
    }
    loadAllResumes();
  }, []);

  function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function toggleShowCreateResume() {
    setShowCreateResume(prevState => !prevState);
    setTitle('');
  }

  async function submitCreateResume(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/resumes/create', { title }, {
        headers: {
          Authorization: token
        }
      });
      setAllResumes(prevResumes => [...prevResumes, data.resume]);
      toggleShowCreateResume();
      navigate(PATH.BUILDER + '/' + data.resume._id);
      toast.success('Resume created successfully');
    } catch (error) {
      toast.error('Failed to create resume. Please try again.');
    }
  }

  function toggleShowUploadResume() {
    setShowUploadResume(prevState => !prevState);
    setTitle('');
  }

  async function submitUploadResume(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, {
        headers: {
          Authorization: token
        }
      });
      toggleShowUploadResume();
      setResume(null);
      navigate(PATH.BUILDER + '/' + data.resumeId);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSetResumeFile(e: React.ChangeEvent<HTMLInputElement>) {
    setResume(e.target.files ? e.target.files[0] : null);
  }

  async function submitEditResume(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await api.put(`/api/resumes/update`, { 
        resumeId: editResumeId,
        resumeData: { title }
       }, {
        headers: {
          Authorization: token
        }
      });
      setAllResumes(prevResumes => prevResumes.map(resume => {
        if (resume._id === editResumeId) {
          return { ...resume, title };
        }
        return resume;
      }));
      setEditResumeId('');
      setTitle('');
      toast.success('Resume updated successfully');
    } catch (error) {
      toast.error('Failed to edit resume. Please try again.');
    }
  }

  async function submitDeleteResume(resumeId: string) {
    const confirm = window.confirm('Are you sure you want to delete this resume?');
    if (confirm) {
      try {
        await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: {
            Authorization: token
          }
        });
        setAllResumes(prevResumes => prevResumes.filter(resume => resume._id !== resumeId));
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resume. Please try again.');
      }
    }
  }

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className="text-2xl-font-meidum mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">Welcome, {user?.name || 'Tony'}</p>

        <div className="flex gap-4">
          <button 
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2 text-slate-600. border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer"
            onClick={toggleShowCreateResume}
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all">Create Resume</p>
          </button>

          <button 
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2 text-slate-600. border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer"
            onClick={toggleShowUploadResume}
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all">Upload Existing</p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = COLORS[index % COLORS.length];
            const isResumeDummy = dummyResumeData.find(dummy => dummy._id === resume._id);
            return (
              <button 
                key={resume._id} 
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all cursor-pointer"
                style={{ 
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + '40',
                }}
                onClick={() => navigate(`${PATH.BUILDER}/${resume._id}`)}
              >
                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" style={{ color: baseColor }} />
                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center" style={{ color: baseColor }}>
                  {resume.title}
                </p>
                <p className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center">
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div 
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                  onClick={e => e.stopPropagation()}
                >
                  {!isResumeDummy && (
                    <TrashIcon 
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                      onClick={() => submitDeleteResume(resume._id)}
                    />
                  )}

                  {!isResumeDummy && (
                    <PencilIcon 
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" 
                      onClick={() => {
                        setEditResumeId(resume._id);
                        setTitle(resume.title);
                      }}
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>
        
        {showCreateResume && (
          <form 
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
            onSubmit={submitCreateResume} 
            onClick={toggleShowCreateResume} 
          >
            <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input 
                type="text" 
                placeholder="Resume Title" 
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600" 
                required 
                value={title}
                onChange={onChangeTitle}
              />
              <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>
              <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={toggleShowCreateResume} />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
            onSubmit={submitUploadResume} 
            onClick={toggleShowUploadResume} 
          >
            <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Updload a Resume</h2>
              <input 
                type="text" 
                placeholder="Resume Title" 
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600" 
                required 
                value={title}
                onChange={onChangeTitle}
              />
              <div>
                <label htmlFor="resume-input" className="block text-sm text-slate-700">
                  Select resume file
                  <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                    {/*  */}
                    {resume ? (
                      <p className="text-green-600">Selected file: {resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p className="text-sm">Click to upload your resume file</p>
                      </>
                    )}
                  </div>
                </label>
                <input 
                  type="file" 
                  id="resume-input" 
                  accept=".pdf" 
                  hidden
                  onChange={handleSetResumeFile}
                />
              </div>
              <button 
                type="submit" 
                className={`w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={toggleShowUploadResume} />
            </div>
          </form>
        )}

        {editResumeId && (
          <form 
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
            onSubmit={submitEditResume} 
            onClick={() => setEditResumeId('')} 
          >
            <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Edit resume</h2>
              <input 
                type="text" 
                placeholder="Resume Title" 
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600" 
                required 
                value={title}
                onChange={onChangeTitle}
              />
              <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Update
              </button>
              <XIcon 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId('');
                  setTitle('');
                }} 
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard