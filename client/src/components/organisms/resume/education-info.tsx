import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import type { IEducation } from '../../../types/types';

interface EducationInfoProps {
  data: IEducation[];
  onChange: (value: IEducation[]) => void;
}

function EducationInfo({ data, onChange }: EducationInfoProps) {

  function addEducation() {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
      _id: Math.random().toString(36).substr(2, 9)
    }
    onChange([...data, newEducation]);
  }

  function removeEducation(index: number) {
    const updatedExperience = data.filter((_, i) => i !== index);
    onChange(updatedExperience);
  }

  function updateEducation({index, field, value}: { index: number, field: keyof IEducation, value: string | boolean}) {
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value};
    onChange(updated);
  }
  
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
          <p className='text-sm text-gray-500'>Add your education details</p>
        </div>
        <button 
          className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50'
          onClick={addEducation}
        >
          <Plus className='size-4'/>
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>No education added yet.</p>
          <p className='text-sm'>Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((edu, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Education #{index + 1}</h4>
                <button 
                  className='text-red-500 hover:text-red-700 transition-colors'
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className='size-4' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input 
                  type='text'
                  value={edu.institution || ''}
                  placeholder='Institution Name'
                  className='px-3 py-2 text-sm'
                  onChange={(e) => 
                    updateEducation({
                      index, 
                      field: "institution", 
                      value: e.target.value
                    })
                  }
                />

                <input 
                  type='text'
                  value={edu.degree || ''}
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  className='px-3 py-2 text-sm'
                  onChange={(e) => 
                    updateEducation({
                      index, 
                      field: "degree", 
                      value: e.target.value
                    })
                  }
                />

                <input 
                  type='text'
                  value={edu.field || ''}
                  placeholder='Field of Study'
                  className='px-3 py-2 text-sm'
                  onChange={(e) => 
                    updateEducation({
                      index, 
                      field: 'field', 
                      value: e.target.value
                    })
                  }
                />

                <input 
                  type='month'
                  value={edu.graduation_date || ''}
                  className='px-3 py-2 text-sm'
                  onChange={(e) => 
                    updateEducation({
                      index, 
                      field: "graduation_date", 
                      value: e.target.value
                    })
                  }
                />
              </div>

              <input 
                type='text'
                value={edu.gpa || ''}
                className='px-3 py-2 text-sm'
                placeholder='GPA (optional)'
                onChange={(e) => 
                  updateEducation({
                    index, 
                    field: "gpa", 
                    value: e.target.value
                  })
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationInfo