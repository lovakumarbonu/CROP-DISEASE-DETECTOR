import { Type } from "@google/genai";

// FIX: Rewrote as a standard function declaration. The arrow function syntax was causing a cryptic "not callable" error, likely due to a toolchain issue.
export function getGeminiPrompt(language: string): string {
    return `You are a world-class expert agricultural botanist and plant pathologist AI. Your goal is to provide a comprehensive, multi-faceted analysis of crop images.

Analyze the provided image which may contain one or more crop leaves or plants. For EACH distinct plant or significant symptom you identify, perform the following analysis:

1.  **Disease Identification**: Identify any visible diseases. If none, classify as healthy.
2.  **Bounding Box**: Provide the location of the primary symptom as a normalized bounding box ('x', 'y', 'width', 'height'). If healthy or location is ambiguous, omit this.
3.  **Early Stress Detection**: Look for subtle signs of stress that may not be full-blown diseases yet (e.g., slight discoloration indicating nutrient deficiency, wilting from water stress). List any detected signs.
4.  **Treatment Plans**: Provide TWO distinct treatment plans:
    *   A plan using standard chemical pesticides/fungicides.
    *   A plan using organic, pesticide-free, or home-remedy solutions (e.g., neem oil, compost tea, biological controls).
5.  **Climate-Aware Predictions**: Based on the identified issue, provide a brief advisory about potential future risks related to common climate conditions (e.g., "High humidity may worsen this fungal infection. Ensure good air circulation.").

**RESPONSE REQUIREMENTS:**

*   Respond ONLY with a single JSON object that is an array of results, even if only one plant is analyzed.
*   Provide all textual fields ('disease_name', 'description', etc.) in the **${language}** language.
*   If the image is not a plant, is unclear, or shows no identifiable crop, return an empty array \`[]\`.
*   Do not include any text, markdown, or "json" specifiers outside of the JSON array.
`;
}

export const GEMINI_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      is_healthy: {
        type: Type.BOOLEAN,
        description: "True if the plant is healthy, false otherwise.",
      },
      disease_name: {
        type: Type.STRING,
        description: "The common name of the detected disease, or 'N/A' if healthy.",
      },
      description: {
        type: Type.STRING,
        description: "A brief, easy-to-understand overview of the disease or the plant's healthy state.",
      },
      treatment_plan_chemical: {
        type: Type.ARRAY,
        description: "A list of actionable steps using chemical treatments.",
        items: { type: Type.STRING },
      },
      treatment_plan_organic: {
          type: Type.ARRAY,
          description: "A list of actionable steps using organic or pesticide-free remedies.",
          items: { type: Type.STRING },
      },
      early_stress_signs: {
          type: Type.ARRAY,
          description: "A list of detected pre-symptomatic stress indicators (e.g., nutrient deficiency).",
          items: { type: Type.STRING },
      },
      climate_advisory: {
          type: Type.STRING,
          description: "A forward-looking advisory based on the detected condition and typical climate factors.",
      },
      disease_location: {
          type: Type.OBJECT,
          description: "Optional. Bounding box of the primary disease location, with normalized coordinates (0-1).",
          properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
          },
      },
    },
    required: ['is_healthy', 'disease_name', 'description', 'treatment_plan_chemical', 'treatment_plan_organic', 'early_stress_signs', 'climate_advisory'],
  }
};