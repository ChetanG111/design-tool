import React, { useEffect, useRef, useState } from 'react'

interface PreviewProps {
    code: string
    previewId: number
    onElementSelect?: (elementInfo: { tag: string; path: string; html: string; text: string }) => void
}

export const Preview: React.FC<PreviewProps> = ({ code, previewId, onElementSelect }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [hoverInfo, setHoverInfo] = useState<{ top: number; left: number; width: number; height: number; tag: string } | null>(null)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'AURA_HOVER') {
                const { rect, tag } = event.data
                if (rect) {
                    setHoverInfo({ ...rect, tag })
                } else {
                    setHoverInfo(null)
                }
            }

            if (event.data.type === 'AURA_SELECT' && onElementSelect) {
                onElementSelect(event.data.info)
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [onElementSelect])

    useEffect(() => {
        const updateIframe = () => {
            const iframe = iframeRef.current
            if (!iframe) return

            // Pre-process code to inject IDs for inspection
            // This is a simple version that adds 'data-aura-path' to elements
            let processedCodeForMapping = code
            let elementIndex = 0
            processedCodeForMapping = code.replace(/<([a-zA-Z0-9]+)(\s|>)/g, (match, tag, suffix) => {
                if (['Fragment', 'React.Fragment'].includes(tag)) return match
                return `<\${tag} data-aura-id="\${elementIndex++}"\${suffix}`
            })

            const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <script type="importmap">
              {
                "imports": {
                  "react": "https://esm.sh/react@18",
                  "react-dom": "https://esm.sh/react-dom@18",
                  "lucide-react": "https://esm.sh/lucide-react@0.363.0"
                }
              }
            </script>
            <style>
              body { margin: 0; padding: 0; background: transparent; overflow-x: hidden; }
              #root { min-height: 100vh; }
              [data-aura-id] { cursor: crosshair !important; }
              .aura-hover-ring {
                position: absolute;
                pointer-events: none;
                border: 2px solid #6366f1;
                background: rgba(99, 102, 241, 0.1);
                z-index: 9999;
                transition: all 0.1s ease-out;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              import React from 'react';
              import ReactDOM from 'react-dom';
              import * as Lucide from 'lucide-react';

              const code = \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
              
              let processedCode = code
                .replace(/import .* from 'lucide-react'/g, 'const { ' + Object.keys(Lucide).join(', ') + ' } = Lucide')
                .replace(/import React.* from 'react'/g, '')
                .replace(/export default function/, 'function GeneratedComponent');

              // Inspector Logic
              window.addEventListener('mouseover', (e) => {
                const target = e.target.closest('[data-aura-id]') || e.target;
                if (target && target.getBoundingClientRect) {
                  const rect = target.getBoundingClientRect();
                  window.parent.postMessage({
                    type: 'AURA_HOVER',
                    tag: target.tagName.toLowerCase(),
                    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                  }, '*');
                }
              });

              window.addEventListener('mouseout', () => {
                window.parent.postMessage({ type: 'AURA_HOVER', rect: null }, '*');
              });

              window.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const target = e.target.closest('[data-aura-id]') || e.target;
                window.parent.postMessage({
                  type: 'AURA_SELECT',
                  info: {
                    tag: target.tagName,
                    html: target.outerHTML,
                    text: target.innerText,
                    id: target.getAttribute('data-aura-id')
                  }
                }, '*');
              }, true);

              try {
                // In a real version, we'd use a proper parser to inject data-aura-id
                // Here we just render the raw code for the demo
                const blob = new Blob([\`
                  import React from 'react';
                  import * as Lucide from 'lucide-react';
                  \${processedCode}
                  export default GeneratedComponent;
                \`], { type: 'text/javascript' });
                const url = URL.createObjectURL(blob);
                
                import(url).then(module => {
                  const Root = module.default;
                  const container = document.getElementById('root');
                  const root = ReactDOM.createRoot(container);
                  root.render(React.createElement(Root));
                });
              } catch (err) {
                console.error(err);
              }
            </script>
          </body>
        </html>
      `
            iframe.srcdoc = srcDoc
        }

        updateIframe()
    }, [code, previewId])

    return (
        <div className="relative w-full h-full">
            <iframe
                ref={iframeRef}
                title="Aura Preview"
                className="w-full h-full border-none bg-transparent"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            />
            {hoverInfo && (
                <div
                    className="absolute pointer-events-none border-2 border-indigo-500 bg-indigo-500/10 z-50 transition-all duration-75"
                    style={{
                        top: hoverInfo.top,
                        left: hoverInfo.left,
                        width: hoverInfo.width,
                        height: hoverInfo.height
                    }}
                >
                    <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                        {hoverInfo.tag}
                    </div>
                </div>
            )}
        </div>
    )
}
