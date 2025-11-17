import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import type { IExperience } from '../../../types/types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import React from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

interface ExperienceInfoProps {
  data: IExperience[];
  onChange: (value: IExperience[]) => void;
}

function ExperienceInfo({ data, onChange }: ExperienceInfoProps) {
  const { token } = useSelector((state: RootState) => state.auth);
  const [generatingIndex, setGeneratingIndex] = React.useState(-1);

  function addExperience() {
    const newExperience = {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false,
    }
    onChange([...data, newExperience]);
  }

  function removeExperience(index: number) {
    const updatedExperience = data.filter((_, i) => i !== index);
    onChange(updatedExperience);
  }

  function updateExperience({index, field, value}: { index: number, field: keyof IExperience, value: string | boolean}) {
   const updated = [...data];
   updated[index] = {...updated[index], [field]: value};
   console.log('updateExperience: ', updated)
   onChange(updated);
  }

  async function generateDescription({ index }: { index: number }) {
    try {
      setGeneratingIndex(index);
      const experience = data[index];
      const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}. Make it more professional and impactful.`;
      const response = await api.post('/api/ai/enhance-job-desscription', {
        userContent: prompt
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      updateExperience({
        index,
        field: 'description',
        value: response?.data?.enhancedContent || ''
      })
    } catch (error) {
      toast.error("Failed to generate job description. Please try again.");
    } finally {
      setGeneratingIndex(-1);
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
          <p className='text-sm text-gray-500'>Add your job experience</p>
        </div>
        <button 
          className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50'
          onClick={addExperience}
        >
          <Plus className='size-4'/>
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>No work experience added yet</p>
          <p className='text-sm'>Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((exp, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Experience #{index + 1}</h4>
                <button 
                  className='text-red-500 hover:text-red-700 transition-colors'
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className='size-4' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input 
                  type='text'
                  value={exp.company || ''}
                  placeholder='Company Name'
                  className='px-3 py-2 text-sm rounded-lg'
                  onChange={(e) => 
                    updateExperience({
                      index, 
                      field: "company", 
                      value: e.target.value
                    })
                  }
                />

                <input 
                  type='text'
                  value={exp.position || ''}
                  placeholder='Job Title'
                  className='px-3 py-2 text-sm rounded-lg'
                  onChange={(e) => 
                    updateExperience({
                      index, 
                      field: "position", 
                      value: e.target.value
                    })
                  }
                />

                <input 
                  type='month'
                  value={exp.start_date || ''}
                  className='px-3 py-2 text-sm rounded-lg'
                  onChange={(e) => 
                    updateExperience({
                      index, 
                      field: "start_date", 
                      value: e.target.value
                    })
                  }
                />

                <input 
                  type='month'
                  value={exp.end_date || ''}
                  className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-100'
                  onChange={(e) => 
                    updateExperience({
                      index, 
                      field: "end_date", 
                      value: e.target.value
                    })
                  }
                />
              </div>

              <label className='flex items-center gap-2'>
                <input 
                  type="checkbox" 
                  checked={Boolean(exp.is_current)}
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  onChange={(e) => updateExperience({
                    index,
                    field: 'is_current',
                    value: e.target.checked
                  })} 
                />
                <span className='text-sm text-gray-700'>Currently working here</span>
              </label>

              <div className='space-y-2'>
                <div className="flex items-center justify-between">
                  <label className='text-sm font-medium text-gray-700'>Job Description</label>
                  <button 
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
                    onClick={() => {
                      generateDescription({ index })
                    }}
                    disabled={generatingIndex === index}
                  >
                    {generatingIndex === index ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <Sparkles  className='size-4'/>
                    )}
                    {generatingIndex === index ? 'Generating...' : 'Enhance with AI'}
                  </button>
                </div>
                <textarea 
                  value={exp.description}
                  rows={4}
                  className='w-full text-sm px-3 py-2 rounded-lg resize-none'
                  placeholder='Describe your key responsibilities and achivements ...'
                  onChange={e => updateExperience({
                    index,
                    field: 'description',
                    value: e.target.value
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceInfo