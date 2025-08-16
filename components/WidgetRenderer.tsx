import React, { useState, useEffect, useMemo } from 'react';

declare global {
    interface Window {
        Babel: any;
    }
}

interface Props {
  jsx: string;
}

const renderScope = { React };

// --- On-demand Babel Loader ---
// We use a module-level variable to track the loading state of the Babel script
// to ensure it's only fetched once, even if multiple WidgetRenderer components mount.
let babelStatus: 'idle' | 'loading' | 'loaded' | 'error' = 'idle';
if (typeof window !== 'undefined' && window.Babel) {
    babelStatus = 'loaded';
}

const loadBabelScript = () => new Promise<void>((resolve, reject) => {
    // If already loaded, resolve immediately.
    if (babelStatus === 'loaded') {
        resolve();
        return;
    }

    // If currently loading, wait for it to finish.
    if (babelStatus === 'loading') {
        const checkInterval = setInterval(() => {
            if (babelStatus === 'loaded') {
                clearInterval(checkInterval);
                resolve();
            }
            if (babelStatus === 'error') {
                clearInterval(checkInterval);
                reject(new Error("Babel script failed to load."));
            }
        }, 100);
        return;
    }

    // If idle, start loading the script.
    babelStatus = 'loading';
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
    script.async = true;
    script.onload = () => {
        babelStatus = 'loaded';
        resolve();
    };
    script.onerror = (err) => {
        babelStatus = 'error';
        reject(err);
    };
    document.body.appendChild(script);
});
// --- End Loader ---


const WidgetRenderer: React.FC<Props> = ({ jsx }) => {
    const [compilerReady, setCompilerReady] = useState(babelStatus === 'loaded');
    const [Component, setComponent] = useState<React.FC | null>(null);
    const [error, setError] = useState<string | null>(null);

    const ErrorBoundary: React.ComponentClass<{children: React.ReactNode}> = useMemo(() => {
        return class extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
            constructor(props: {children: React.ReactNode}) {
                super(props);
                this.state = { hasError: false, error: null };
            }

            static getDerivedStateFromError(error: any) {
                return { hasError: true, error };
            }
            
            componentDidCatch(error: any, errorInfo: any) {
                console.error("Error rendering widget component:", error, errorInfo);
            }

            render() {
                if (this.state.hasError) {
                    return (
                        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                            <p className="font-bold">Widget Component Error</p>
                            <pre className="text-xs mt-2 whitespace-pre-wrap">{this.state.error?.message || 'An unknown error occurred'}</pre>
                        </div>
                    );
                }
                return this.props.children;
            }
        };
    }, []);
    
    useEffect(() => {
        if (compilerReady) return;
        let isMounted = true;
        loadBabelScript()
            .then(() => {
                if (isMounted) setCompilerReady(true);
            })
            .catch(() => {
                if (isMounted) setError("Critical Error: Failed to load the widget compiler.");
            });
        return () => { isMounted = false };
    }, [compilerReady]);


    useEffect(() => {
        if (!compilerReady) return;

        let isMounted = true;
        
        const renderWidget = () => {
            try {
                if (!window.Babel) {
                    throw new Error("Babel is not loaded.");
                }

                setError(null);
                
                let codeToTransform = jsx.trim();

                const declarationRegex = /^(?:const|let|var)\s+\w+\s*=\s*/;
                if (declarationRegex.test(codeToTransform)) {
                    codeToTransform = codeToTransform.replace(declarationRegex, '');
                }
                
                const transformedCode = window.Babel.transform(
                    `(${codeToTransform})`,
                    { presets: ['react'] }
                ).code;

                const componentFunction = new Function(...Object.keys(renderScope), `return ${transformedCode}`);
                const RenderableComponent = componentFunction(...Object.values(renderScope));

                if (!isMounted) return;

                if (typeof RenderableComponent === 'function') {
                    setComponent(() => RenderableComponent);
                } else if (React.isValidElement(RenderableComponent)) {
                    setComponent(() => () => RenderableComponent);
                } else {
                    throw new Error("Generated code is not a valid React component.");
                }

            } catch (e: any) {
                console.error("Widget compilation error:", e);
                if (isMounted) {
                    setError(e.message);
                    setComponent(null);
                }
            }
        };
        
        renderWidget();

        return () => {
            isMounted = false;
        };
    }, [jsx, compilerReady]);

    if (!compilerReady) {
        return (
             <div className="p-4 flex items-center justify-center text-slate-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Initializing Widget Compiler...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                <p className="font-bold">Widget Compilation Error</p>
                <pre className="text-xs mt-2 whitespace-pre-wrap">{error}</pre>
            </div>
        );
    }

    if (!Component) {
        return (
            <div className="p-4 flex items-center justify-center text-slate-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rendering Widget...
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <Component />
        </ErrorBoundary>
    );
};

export default WidgetRenderer;