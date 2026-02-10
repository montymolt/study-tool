// AI integration module (optional, phase 2)
export const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true';

export async function generateExplanation(prompt:string){
  if(!AI_ENABLED) return 'AI disabled';
  // placeholder for OpenAI/Claude calls
  if(process.env.OPENAI_API_KEY){
    // using fetch to OpenAI
    return 'Generated explanation (placeholder)';
  }
  return 'No AI key configured';
}
