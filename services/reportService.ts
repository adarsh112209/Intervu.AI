import { GoogleGenAI, Type } from '@google/genai';
import { InterviewReport, TranscriptItem } from '../types';

export async function generateInterviewReport(
  apiKey: string,
  transcript: TranscriptItem[],
  company: string,
  role: string
): Promise<InterviewReport> {
  const ai = new GoogleGenAI({ apiKey });

  // Handle empty transcript case
  if (!transcript || transcript.length === 0) {
      return {
          technicalScore: 0,
          behaviorScore: 0,
          confidenceScore: 0,
          selected: false,
          feedback: "No audio was detected during the interview session. Please check your microphone settings and try again.",
          strengths: [],
          weaknesses: ["Microphone input not detected", "Session too short"],
          transcript: [],
          date: new Date().toLocaleDateString(),
          company,
          role
      };
  }

  // Format transcript for the prompt
  const conversationText = transcript
    .map((t) => `${t.role.toUpperCase()}: ${t.text}`)
    .join('\n');

  const prompt = `
    Analyze the following job interview transcript for a ${role} position at ${company}.
    Provide a detailed assessment in JSON format.
    
    Transcript:
    ${conversationText}
    
    Requirement:
    - technicalScore: 0-100. (If the interview is purely behavioral/HR, base this score on the candidate's knowledge of the role, company, and industry).
    - behaviorScore: 0-100 based on soft skills, STAR method usage, and cultural fit.
    - confidenceScore: 0-100 based on clarity, tone, and delivery.
    - selected: boolean (true if passed, false if rejected).
    - feedback: A paragraph summarizing the performance.
    - strengths: Array of strings (key strengths).
    - weaknesses: Array of strings (areas for improvement).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalScore: { type: Type.INTEGER },
            behaviorScore: { type: Type.INTEGER },
            confidenceScore: { type: Type.INTEGER },
            selected: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['technicalScore', 'behaviorScore', 'confidenceScore', 'selected', 'feedback', 'strengths', 'weaknesses']
        },
      },
    });

    const result = JSON.parse(response.text || '{}');

    return {
      ...result,
      transcript,
      date: new Date().toLocaleDateString(),
      company,
      role
    };

  } catch (error) {
    console.error("Error generating report:", error);
    // Fallback if AI generation fails
    return {
      technicalScore: 0,
      behaviorScore: 0,
      confidenceScore: 0,
      selected: false,
      feedback: "Could not generate report due to an error.",
      strengths: [],
      weaknesses: [],
      transcript,
      date: new Date().toLocaleDateString(),
      company,
      role
    };
  }
}

export async function getJobRecommendations(apiKey: string, resumeText: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze the following resume summary and suggest 3 specific, modern job titles that this candidate is best suited for.
    Focus on the tech industry if applicable.
    
    Resume: "${resumeText.slice(0, 2000)}"
    
    Return ONLY a JSON array of strings. Example: ["Senior Frontend Engineer", "Product Manager", "DevOps Specialist"]
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error getting recommendations", error);
    return ['Software Engineer', 'Product Manager', 'Data Analyst']; // Fallback
  }
}

export async function analyzeResume(apiKey: string, base64Pdf: string): Promise<{ text: string, score: number }> {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert technical recruiter and resume analyst.
      
      Task:
      1. Extract the full text content from the provided PDF resume.
      2. Analyze the quality of the resume based on structure, clarity, impact metrics, and keywords.
      3. Assign a "Resume Score" from 0 to 100.
      
      Return JSON:
      {
        "text": "The full extracted text...",
        "score": 85
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: base64Pdf
                    }
                },
                { text: prompt }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        score: { type: Type.INTEGER }
                    },
                    required: ['text', 'score']
                }
            }
        });

        return JSON.parse(response.text || '{"text": "", "score": 0}');
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw new Error("Failed to analyze resume. Please ensure it is a valid PDF.");
    }
}