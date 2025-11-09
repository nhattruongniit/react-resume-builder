export interface IExperience {
  company: string,
  position: string,
  start_date: string,
  end_date: string,
  description: string,
  is_current: boolean,
  _id: string
}

export interface IEducation {
  institution: string,
  degree: string,
  field: string,
  graduation_date: string,
  gpa: string,
  _id: string
}

export interface IProject {
  name: string,
  type: string,
  description: string,
  _id: string
}

export interface IPersonalInfo {
    full_name: string,
    email: string,
    phone: string,
    location: string,
    linkedin?: string,
    website?: string,
    profession: string,
    image?: string
}

export interface IResume {
  personal_info: IPersonalInfo | null,
  _id: string,
  userId?: string,
  title: string,
  public: boolean,
  professional_summary: string,
  skills: string[],
  experience: IExperience[],
  education: IEducation[],
  template: string,
  accent_color: string,
  project: IProject[],
  updatedAt: string,
  createdAt: string,
}
