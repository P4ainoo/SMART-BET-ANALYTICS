import { GoogleGenAI, Type } from "@google/genai";
import { MatchData, ParlayRecommendation, UserSettings } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean JSON markdown
const cleanJson = (text: string) => {
  let clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  return clean.trim();
};

export const fetchUpcomingMatches = async (leagues: string[], date: string): Promise<{ matches: MatchData[], rawContext: string }> => {
  try {
    const model = 'gemini-2.5-flash';
    const leagueStr = leagues.join(", ");
    
    const prompt = `
      Find football matches for the following leagues: ${leagueStr} scheduled for ${date}.
      
      For each identified match:
      1. Identify Home Team, Away Team, Date/Time.
      2. Search for current betting odds.
      3. CRITICAL: Search for KEY HISTORICAL DATA and TRENDS. 
         - Look for Head-to-Head (H2H) records over the last 3 years.
         - Look for recent form (last 5 matches) for both teams.
         - Look for specific stats relevant to betting (e.g., "Team A has seen Over 2.5 goals in 80% of home games", "Team B has not kept a clean sheet in 10 games").
      
      Return the data as a comprehensive structured text summary. I need this raw text to contain detailed historical context for a deep statistical analysis.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || "No specific match data found.";
    
    // Formatting for UI display
    const formattingPrompt = `
      Extract a list of matches from this text:
      "${rawText}"
      
      Return ONLY a JSON array with this schema:
      [
        {
          "id": "unique_string",
          "league": "string",
          "homeTeam": "string",
          "awayTeam": "string",
          "date": "string",
          "formAnalysis": "short summary string including any mentioned historical trends"
        }
      ]
    `;

    const formatResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattingPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const matches = JSON.parse(cleanJson(formatResponse.text || "[]"));
    return { matches, rawContext: rawText };

  } catch (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to search for matches.");
  }
};

export const analyzeAndGenerateParlays = async (
  matchesContext: string,
  settings: UserSettings
): Promise<ParlayRecommendation[]> => {
  try {
    const model = 'gemini-3-pro-preview';
    
    const prompt = `
      You are an expert football betting quantitative analyst.
      
      CRITICAL USER INSTRUCTION:
      The user has explicitly requested an "ALL IN" strategy. 
      They want to bet their ENTIRE bankroll ($${settings.bankroll}) on the generated parlays.
      They want LOW RISK individual legs (High Probability) combined to reach a specific TARGET ODDS.

      User Settings:
      - Bankroll: $${settings.bankroll}
      - Target Date: ${settings.targetDate}
      - Target Total Odds: ${settings.targetOdds} (Approximate this value)
      - Preferred Markets: ${settings.preferredMarkets.join(", ")}
      - Max Legs: ${settings.maxLegs}

      Context Data (Upcoming Matches, Odds, & Historical Info):
      ${matchesContext}

      Task:
      1. Analyze the matches and historical trends.
      2. Identify the safest, lowest risk selections (e.g., Double Chance, Over 1.5 Goals, clear Favorites).
      3. Construct 3 to 5 Parlay Recommendations.
         - Each parlay must aim for the 'Target Total Odds' of ${settings.targetOdds}.
         - Use up to ${settings.maxLegs} legs to reach this target.
      4. STAKE SIZING: 
         - You MUST recommend a stake of exactly $${settings.bankroll} (100% of bankroll).
         - Explicitly state "ALL IN" in the reasoning.

      Return a JSON array of 'ParlayRecommendation' objects adhering to this schema:
      
      {
        "id": "string",
        "legs": [
          {
            "matchId": "string",
            "selection": "string",
            "odds": number,
            "modelProbability": number (0-100),
            "edge": number,
            "reasoning": "string",
            "historicalInsight": "string (Key trend from previous seasons/H2H supporting this pick)"
          }
        ],
        "totalOdds": number,
        "modelWinProbability": number (0-100),
        "expectedValue": number,
        "recommendedStake": number,
        "stakePercentage": number,
        "riskLevel": "Safe" | "Medium" | "Risky",
        "confidenceScore": number (1-10),
        "overallReasoning": "string (Start this string with 'ALL IN RECOMMENDATION: ...')"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: 'application/json'
      },
    });

    const jsonStr = cleanJson(response.text || "[]");
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Error analyzing parlays:", error);
    throw new Error("Failed to generate analysis.");
  }
};