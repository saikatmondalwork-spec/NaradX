// NaradX Gemini AI Service
// Provides AI classification for reports and intelligence queries

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured. AI features will use fallbacks.');
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return model;
}

/**
 * Classify a citizen report using Gemini.
 * Returns AI classification, severity suggestion, and translation if non-English.
 */
export async function classifyReport(description, category, language) {
  const m = getModel();
  if (!m) {
    // Fallback when no API key
    return {
      classification: `${category} Infrastructure - Pending Review`,
      severity: 'Medium',
      translated_english: language !== 'English' ? '[Translation unavailable - API key not set]' : null,
    };
  }

  try {
    const prompt = `You are an AI assistant for a civic infrastructure platform called NaradX.
A citizen submitted the following infrastructure issue report.

Language: ${language}
Category hint: ${category}
Report text: "${description}"

Your task:
1. Classify the issue into a specific infrastructure sub-category (e.g. "Road Damage - Pothole", "Water Infrastructure - Pipe Leak", etc.)
2. Suggest a severity level: Low, Medium, High, or Critical
3. If the report is NOT in English, provide an English translation of the report text. If it IS in English, set translated_english to null.

Respond with ONLY valid JSON, no markdown, no explanation:
{"classification": "string", "severity": "Low|Medium|High|Critical", "translated_english": "string or null"}`;

    const result = await m.generateContent(prompt);
    let text = result.response.text();
    
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }
    
    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini classifyReport error:', err);
    return {
      classification: `${category} Infrastructure - AI Classification Failed`,
      severity: 'Medium',
      translated_english: null,
    };
  }
}

/**
 * Answer a civic analytics query using Gemini, grounded in real report data.
 */
export async function answerCivicQuery(query, reportsContext) {
  const m = getModel();
  if (!m) {
    return {
      answer: `NaradX analysis for: "${query}". AI features require a Gemini API key. Please configure VITE_GEMINI_API_KEY in your .env file.`,
      keyFindings: ['Gemini API key not configured', 'Set VITE_GEMINI_API_KEY in .env to enable AI insights'],
      statistics: { reportCount: 0, populationImpacted: 0, priorityScore: 0 },
      confidence: 0.0,
    };
  }

  try {
    const prompt = `You are NaradX Intelligence, an AI civic analytics assistant for a municipal infrastructure platform in India.

You have access to the following real citizen report data from the database:
${reportsContext}

A municipal policy officer has asked the following question:
"${query}"

Analyze the data and provide a detailed, evidence-based response. Be specific with numbers and locations.

Respond with ONLY valid JSON, no markdown, no explanation:
{
  "answer": "A detailed 2-3 sentence analytical response grounded in the data",
  "keyFindings": ["finding 1", "finding 2", "finding 3", "finding 4"],
  "statistics": {"reportCount": number, "populationImpacted": number, "priorityScore": number},
  "confidence": 0.0 to 1.0
}`;

    const result = await m.generateContent(prompt);
    let text = result.response.text();
    
    // Robust JSON extraction
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }
    
    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini answerCivicQuery error:', err);
    return {
      answer: `Analysis attempted for "${query}" but encountered an error: ${err.message}. Please try rephrasing your question.`,
      keyFindings: ['AI analysis temporarily unavailable', 'Try again in a moment'],
      statistics: { reportCount: 0, populationImpacted: 0, priorityScore: 0 },
      confidence: 0.0,
    };
  }
}
