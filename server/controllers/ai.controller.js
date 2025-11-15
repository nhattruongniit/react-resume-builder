import geminiAI from '../configs/ai.js';
import Resume from '../models/Resume.js';

// POST: /api/ai/enhance-pro-sum -> enhance professional summary resume
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if(!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await geminiAI.chat.completions.create({
      model: process.env.GEMINI_MODAL_NAME,
      messages: [
        { role: "system", content: `You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly, and only return text no options or anything else.` },
        { role: "user", content: userContent }
      ],
      // max_tokens: 300,
      // temperature: 0.7,
    });

    const enhancedContent = response.choices[0].message.content.trim();
    res.status(200).json({ enhancedContent });
  } catch (error) { 
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST: /api/ai/enhance-job-desscription -> enhance job description summary resume
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if(!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await geminiAI.chat.completions.create({
      model: process.env.GEMINI_MODAL_NAME,
      messages: [
        { role: "system", content: `You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly, and only return text no options or anything else.`},
        { role: "user", content: userContent }
      ],
      // max_tokens: 300,
      // temperature: 0.7,
    });

    const enhancedContent = response.choices[0].message.content.trim();
    res.status(200).json({ enhancedContent });
  } catch (error) { 
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST: /api/ai/upload-resume -> upload resume to the database
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    if(!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const userId = req.userId;
    const systemPrompt = "You are expert AI Agent to extract data from resume."
    const userPrompt = `Extract data from this resume: ${resumeText}. Provide data in the following JSON format with no additional text before or after: 
      professional_summary: {
        type: String,
        default: ''
      },
      skills: [{
        type: 'string'
      }],
      personal_info: {
        image: { type: String, default: '' },
        full_name: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
      },
      experience: [
        {
          company: { type: String, default: '' },
          position: { type: String, default: '' },
          start_date: { type: String, default: '' },
          end_date: { type: String, default: '' },
          description: { type: String, default: '' },
          is_current: { type: Boolean, default: false },
        }
      ],
      project: [
        {
          name: { type: String, default: '' },
          type: { type: String, default: '' },
          description: { type: String, default: '' },
        }
      ],
      education: [
        {
          institution: { type: String, default: '' },
          degree: { type: String, default: '' },
          field: { type: String, default: '' },
          graduation_date: { type: String, default: '' },
          gpa: { type: String, default: '' },
        }
      ],
    `
    const response = await geminiAI.chat.completions.create({
      model: process.env.GEMINI_MODAL_NAME,
      messages: [
        { role: "system", content: systemPrompt},
        { role: "user", content: userPrompt }
      ],
      response_format: { type: 'json_object'}
      // max_tokens: 300,
      // temperature: 0.7,
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData
    })
    res.status(200).json({ resumeId: newResume._id });
  } catch (error) { 
    res.status(500).json({ message: "Internal server error" });
  }
}