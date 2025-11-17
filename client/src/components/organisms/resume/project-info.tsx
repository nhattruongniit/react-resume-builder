import { Plus, Trash2 } from "lucide-react";
import type { IProject } from "../../../types/types";

interface ProjectInfoProps {
  data: IProject[];
  onChange: (value: IProject[]) => void;
}

function ProjectInfo({ data, onChange }: ProjectInfoProps) {

  function addProject() {
    const newProject = {
      name: "",
      type: "",
      description: "",
    }
    onChange([...data, newProject]);
  }

  function removeProject(index: number) {
    const updatedExperience = data.filter((_, i) => i !== index);
    onChange(updatedExperience);
  }

  function updateProject({index, field, value}: { index: number, field: keyof IProject, value: string | boolean}) {
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value};
    onChange(updated);
  }
  
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
          <p className='text-sm text-gray-500'>Add your projects</p>
        </div>
        <button 
          className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50'
          onClick={addProject}
        >
          <Plus className='size-4'/>
          Add Project
        </button>
      </div>

       <div className='space-y-4 mt-6'>
        {data.map((project, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
            <div className='flex justify-between items-start'>
              <h4>Project #{index + 1}</h4>
              <button 
                className='text-red-500 hover:text-red-700 transition-colors'
                onClick={() => removeProject(index)}
              >
                <Trash2 className='size-4' />
              </button>
            </div>

            <div className='grid gap-3'>
              <input 
                type='text'
                value={project.name || ''}
                placeholder='Project Name'
                className='px-3 py-2 text-sm rounded-lg'
                onChange={(e) => 
                  updateProject({
                    index, 
                    field: "name", 
                    value: e.target.value
                  })
                }
              />

              <input 
                type='text'
                value={project.type || ''}
                placeholder='Project Type'
                className='px-3 py-2 text-sm rounded-lg'
                onChange={(e) => 
                  updateProject({
                    index, 
                    field: "type", 
                    value: e.target.value
                  })
                }
              />

              <textarea 
                value={project.description}
                rows={4}
                className='w-full text-sm px-3 py-2 rounded-lg resize-none'
                placeholder='Describe your project ...'
                onChange={e => updateProject({
                  index,
                  field: 'description',
                  value: e.target.value
                })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectInfo