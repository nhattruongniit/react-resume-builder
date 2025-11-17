import fs from "fs";
import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";

// GET: /api/resumes -> get all resumes
export const getResumes = async (req, res) => {
  try {
    // const resumes = await Resume
    // how to fill all 
    const resumes = await Resume.find();
    res.status(200).json({
      message: "Resumes retrieved successfully",
      resumes
    });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// POST: /api/resumes/create -> create a new resume
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    
    if(!title) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newResume = new Resume({
      userId,
      title
    });
    await newResume.save();
    
    res.status(201).json({
      message: "Resume created successfully",
      resume: newResume
    });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// DELETE: /api/resumes/delete  -> delete a resume by id
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    
    await Resume.findOneAndDelete({ _id: resumeId, userId });
    
    res.status(200).json({
      message: "Resume deleted successfully"
    });
  }
  catch (error) {
    res.status(400).json({ message: 'Failed to delete resume. Please try again.' });
  }
}

// GET: /api/resumes/get -> get user resume by resume id
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if(!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      message: "Resume retrieved successfully",
      resume
    });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET: /api/resumes/public -> get resume by id public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    const resume = await Resume.findOne({ _id: resumeId, public: true });

    if(!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      message: "Resume retrieved successfully",
      resume
    });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET: /api/resumes/update -> update resume by id
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      resumeId,
      resumeData,
      removeBackground
    } = req.body;
    const image = req.file;

    let resumeDataCopy = '';
    if(typeof resumeData === 'string') {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    if(image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: 'resume-' + Date.now() + '.png',
        folder: 'user-resumes',
        transformation: {
          pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
        }
      });
      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findByIdAndUpdate(
      {
        userId,
        _id: resumeId
      },
      resumeDataCopy,
      { new: true }
    );

    res.status(200).json({
      message: "Resume updated successfully",
      resume
    });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}