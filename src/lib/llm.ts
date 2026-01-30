import { DesignConfig } from '../store/useDesignStore'
import { generateSuperPrompt } from './orchestrator'

export async function streamComponent(
    config: DesignConfig,
    onChunk: (chunk: string) => void
): Promise<string> {
    const prompt = generateSuperPrompt(config)

    // For now, we simulate a stream. 
    // In a real implementation, this would call OpenAI/Gemini via a proxy or direct API

    console.log('--- GENERATING WITH PROMPT ---')
    console.log(prompt)

    return new Promise((resolve) => {
        let fullCode = ''
        const mockResponse = `import React from 'react';
import { Zap, ArrowRight, Star } from 'lucide-react';

export default function Component() {
  return (
    <div className="min-h-[500px] w-full flex items-center justify-center bg-slate-950 p-8">
      <div className="max-w-4xl w-full p-12 rounded-${config.tokens.borderRadius} border border-white/10 bg-white/5 backdrop-blur-xl shadow-${config.tokens.shadow}">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-${config.tokens.primaryColor} flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-bold tracking-widest text-${config.tokens.primaryColor} uppercase">Aura Build</span>
        </div>
        
        <h1 className="text-5xl font-black text-white mb-6 leading-tight">
          High Performance <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-${config.tokens.primaryColor} to-${config.tokens.secondaryColor}">
            Digital Experiences
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg mb-10 max-w-2xl leading-relaxed">
          The next generation of design-to-code orchestration. Built for speed, 
          precision, and visual excellence.
        </p>
        
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-${config.tokens.primaryColor} text-white font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
            View Source
          </button>
        </div>

        <div className="mt-12 pt-12 border-t border-white/10 flex items-center gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-zinc-500 text-sm font-medium">Top Tier Performance</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`

        let index = 0
        const interval = setInterval(() => {
            if (index < mockResponse.length) {
                const chunk = mockResponse.slice(index, index + 20)
                fullCode += chunk
                onChunk(chunk)
                index += 20
            } else {
                clearInterval(interval)
                resolve(fullCode)
            }
        }, 50)
    })
}

export function sanitizeCode(code: string): string {
    // Remove markdown blocks if any
    let clean = code.replace(/```(jsx|tsx|javascript|typescript)?/g, '')
    clean = clean.replace(/```/g, '')

    // Basic sanity check for exports
    if (!clean.includes('export default')) {
        console.warn('LLM output missing export default. Attempting to fix...')
        // Fix logic could go here
    }

    return clean.trim()
}
