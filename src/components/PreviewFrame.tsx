"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';

interface PreviewFrameProps {
    code: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { designTokens } = useStore();

    // Sync tokens (Sprint 6)
    useEffect(() => {
        if (!iframeRef.current?.contentDocument) return;
        const doc = iframeRef.current.contentDocument;
        doc.documentElement.style.setProperty('--primary', designTokens.primary);
        doc.documentElement.style.setProperty('--radius', designTokens.radius);

        // Update tailwind config dynamically if possible, but CSS variables are easier
        const script = doc.createElement('script');
        script.textContent = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '${designTokens.primary}',
            },
            borderRadius: {
              xl: '${designTokens.radius}',
            }
          }
        }
      }
    `;
        doc.head.appendChild(script);
    }, [designTokens, code]);

    useEffect(() => {
        if (!iframeRef.current) return;

        const iframe = iframeRef.current;

        const script = `
      try {
        const { useState, useEffect, useMemo, useRef } = React;
        ${code.replace(/export default/g, 'window.PreviewComponent = ')}
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(window.PreviewComponent || (() => null)));
      } catch (err) {
        window.parent.postMessage({ type: 'error', message: err.message }, '*');
      }
    `;

        const inspectorScript = `
      (function() {
        let highlight = document.createElement('div');
        highlight.style.position = 'absolute';
        highlight.style.pointerEvents = 'none';
        highlight.style.border = '2px solid #3b82f6';
        highlight.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        highlight.style.zIndex = '9999';
        highlight.style.display = 'none';
        highlight.style.borderRadius = '2px';
        highlight.style.transition = 'all 0.1s ease';
        document.body.appendChild(highlight);

        document.addEventListener('mouseover', (e) => {
          const target = e.target;
          if (target === document.body || target === document.documentElement) return;
          
          const rect = target.getBoundingClientRect();
          highlight.style.width = rect.width + 'px';
          highlight.style.height = rect.height + 'px';
          highlight.style.top = (rect.top + window.scrollY) + 'px';
          highlight.style.left = (rect.left + window.scrollX) + 'px';
          highlight.style.display = 'block';
        });

        document.addEventListener('mouseout', () => {
          highlight.style.display = 'none';
        });

        document.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target;
          
          const info = {
            type: 'node-selected',
            tagName: target.tagName,
            className: target.className,
            textContent: target.textContent?.slice(0, 20),
            path: getPath(target)
          };
          window.parent.postMessage(info, '*');
        }, true);

        function getPath(el) {
          const path = [];
          while (el.parentNode) {
            path.unshift(el.tagName + (el.id ? '#' + el.id : ''));
            el = el.parentNode;
          }
          return path.join(' > ');
        }
      })();
    `;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
          <script src="https://unpkg.com/lucide@latest"></script>
          <style>
            :root {
              --primary: ${designTokens.primary};
              --radius: ${designTokens.radius};
            }
            body { margin: 0; background-color: transparent; cursor: crosshair; color: white; font-family: sans-serif; }
            #root { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          </style>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '${designTokens.primary}',
                  },
                  borderRadius: {
                    xl: '${designTokens.radius}',
                  }
                }
              }
            }
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script>
            window.framerMotion = window.Motion;
            window.React = React;
            window.ReactDOM = ReactDOM;
            
            window.onerror = function(msg) {
              window.parent.postMessage({ type: 'error', message: msg }, '*');
            };
            ${inspectorScript}
          </script>
          <script type="text/javascript">${script}</script>
        </body>
      </html>
    `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframe.src = url;

        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'error') {
                setError(event.data.message);
            } else {
                setError(null);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            URL.revokeObjectURL(url);
        };
    }, [code]);

    return (
        <div className="w-full h-full relative group">
            {error && (
                <div className="absolute top-4 left-4 right-4 z-50 p-3 bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-lg text-red-400 text-xs font-mono">
                    <p className="font-bold mb-1">Runtime Error:</p>
                    {error}
                </div>
            )}
            <iframe
                ref={iframeRef}
                className="w-full h-full border-none bg-transparent"
                title="Preview"
            />
        </div>
    );
};
