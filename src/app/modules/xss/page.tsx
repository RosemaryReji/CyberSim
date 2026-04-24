"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShieldAlert, Code, MessageSquare, TerminalSquare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function XSSSimulation() {
  const [code, setCode] = useState(`// User profile comment logic
function renderComment(comment) {
  const commentBoard = document.getElementById('comments');
  
  // Vulnerability: Direct DOM insertion without sanitization
  const commentHTML = \`
    <div class="comment-card">
      <div class="comment-author">Guest User</div>
      <div class="comment-body">\${comment}</div>
    </div>
  \`;
  
  commentBoard.innerHTML += commentHTML;
}

// Simulated payload injection
renderComment("<img src='x' onerror='alert(\\"XSS Exploit Successful!\\")'>");
`);

  const [executedCode, setExecutedCode] = useState(code);
  const [isExploited, setIsExploited] = useState(false);
  const [isPatched, setIsPatched] = useState(false);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const alertFiredRef = useRef(false);

  const router = useRouter();
  const completeModuleMutation = trpc.completeModule.useMutation();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'xss-alert') {
        alertFiredRef.current = true;
        setIsExploited(true);
      }
      if (event.data?.type === 'xss-error') {
        setSyntaxError(event.data.message);
      }
      if (event.data?.type === 'xss-loaded') {
        if (!alertFiredRef.current && code.includes('DOMPurify.sanitize')) {
          setIsPatched(true);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [code]);

  const handleRunCode = () => {
    setIsExploited(false);
    setIsPatched(false);
    setSyntaxError(null);
    alertFiredRef.current = false;
    
    // Briefly clear executed code to force iframe to re-render fresh
    setExecutedCode("");
    setTimeout(() => setExecutedCode(code), 50);
  };

  const handleReset = () => {
    setIsExploited(false);
    setIsPatched(false);
    setSyntaxError(null);
    alertFiredRef.current = false;
    
    const resetCode = `// User profile comment logic\nfunction renderComment(comment) {\n  const commentBoard = document.getElementById('comments');\n  \n  // Vulnerability: Direct DOM insertion without sanitization\n  const commentHTML = \`\n    <div class="comment-card">\n      <div class="comment-author">Guest User</div>\n      <div class="comment-body">\${comment}</div>\n    </div>\n  \`;\n  \n  commentBoard.innerHTML += commentHTML;\n}\n\n// Simulated payload injection\nrenderComment("<img src='x' onerror='alert(\\"XSS Exploit Successful!\\")'>");\n`;
    setCode(resetCode);
    setExecutedCode("");
    setTimeout(() => setExecutedCode(resetCode), 50);
  };

  const handleComplete = () => {
    completeModuleMutation.mutate(
      { moduleId: "xss", score: 100 },
      {
        onSuccess: () => {
          router.push("/dashboard/modules");
        }
      }
    );
  };

  const getIframeSrcDoc = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 20px; background-color: #020617; color: #f8fafc; margin: 0; }
          .header { background-color: #f1f5f9; padding: 16px; color: #0f172a; font-weight: bold; border-top-left-radius: 8px; border-top-right-radius: 8px; }
          .comments-container { background-color: #ffffff; padding: 24px; min-height: 300px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
          .comment-card { border: 1px solid #fecaca; background-color: #fef2f2; padding: 16px; border-radius: 4px; position: relative; margin-top: 16px; color: #0f172a; }
          .comment-card::before { content: "VULNERABLE ZONE"; position: absolute; top: 0; right: 0; background-color: #ef4444; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; text-transform: uppercase; border-bottom-left-radius: 4px; border-top-right-radius: 4px; }
          .comment-author { font-weight: bold; font-size: 14px; margin-bottom: 4px; }
          .comment-body { font-size: 14px; color: #dc2626; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
          .legit-card { border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 16px; border-radius: 4px; color: #0f172a; }
        </style>
        <script>
          const originalAlert = window.alert;
          window.alert = function(msg) {
            window.parent.postMessage({ type: 'xss-alert', message: msg }, '*');
          };
          window.onerror = function(msg) {
            window.parent.postMessage({ type: 'xss-error', message: msg }, '*');
            return false;
          };
        </script>
      </head>
      <body>
        <div class="header">Latest Blog Post Comments</div>
        <div class="comments-container" id="comments">
          <div class="legit-card">
            <div class="comment-author">AdminUser</div>
            <div style="font-size: 14px;">Great post! Looking forward to the next one.</div>
          </div>
        </div>
        <script>
          try {
            ${executedCode}
            // Add a slight delay to allow any onerror injected attributes to fire first
            setTimeout(() => {
              window.parent.postMessage({ type: 'xss-loaded' }, '*');
            }, 100);
          } catch (e) {
            document.getElementById('comments').innerHTML += '<div style="color:red; margin-top:16px;">Syntax Error: ' + e.message + '</div>';
            window.parent.postMessage({ type: 'xss-error', message: e.message }, '*');
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 max-w-[1500px] mx-auto relative">
      <AnimatePresence>
        {isExploited && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl text-center"
            >
              <Card glow="none" className="p-10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col items-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-2">Payload Executed</h2>
                <p className="text-red-400 font-mono mb-8 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">XSS Vulnerability Confirmed.</p>
                
                <p className="text-foreground/80 mb-10 leading-relaxed">
                  The injected script was executed by the browser because the application failed to sanitize untrusted user input before rendering it into the DOM.
                </p>

                <Button 
                  variant="primary" 
                  className="w-full h-14 text-lg tracking-widest uppercase border-red-500/50 hover:bg-red-500/20 text-red-400 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]"
                  onClick={() => setIsExploited(false)}
                >
                  Proceed to Patching
                </Button>
              </Card>
            </motion.div>
          </div>
        )}

        {isPatched && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl text-center"
            >
              <Card glow="green" className="p-10 border-green-500/50 flex flex-col items-center">
                <ShieldAlert className="w-16 h-16 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-2">Vulnerability Patched</h2>
                <p className="text-green-400 font-mono mb-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">XSS Execution Prevented.</p>
                
                <p className="text-foreground/80 mb-10 leading-relaxed">
                  Excellent work! By wrapping the untrusted input in <code className="text-white bg-white/10 px-1 rounded">DOMPurify.sanitize()</code>, you successfully stripped out the malicious HTML tags before they could be rendered by the browser.
                </p>

                <Button 
                  variant="primary" 
                  className="w-full h-14 text-lg tracking-widest uppercase border-green-500/50 hover:bg-green-500/20 text-green-400 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]"
                  onClick={handleComplete}
                  disabled={completeModuleMutation.isPending}
                >
                  {completeModuleMutation.isPending ? "Syncing Grid..." : "Return to Dashboard"}
                </Button>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/modules">
            <Button variant="ghost" className="px-3 border-white/10 hover:bg-white/5">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Abort
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-accent" />
              Module: <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Cross-Site Scripting</span>
            </h1>
            <p className="text-foreground/60 font-mono text-sm">Exploit and patch a vulnerable DOM-based application.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Column: Code Editor */}
        <Card glow="cyan" className="flex flex-col bg-[#050505] border-accent/20 overflow-hidden relative p-0">
          <div className="p-4 border-b border-white/10 bg-[#020202] flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Code className="w-4 h-4 text-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-accent drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Source Code Editor - comment.js</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={handleReset} className="h-8 text-xs font-mono text-foreground/60 hover:text-white px-2">
                <RefreshCw className="w-3 h-3 mr-2" /> Reset
              </Button>
              <Button variant="primary" onClick={handleRunCode} className="h-8 text-xs font-mono">
                <TerminalSquare className="w-3 h-3 mr-2" /> Run Code
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-0 relative bg-[#0a0a0a]">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-green-400 font-mono text-sm p-6 outline-none resize-none leading-relaxed selection:bg-accent/30 selection:text-white"
              spellCheck="false"
            />
          </div>
        </Card>

        {/* Right Column: Vulnerable App Preview */}
        <Card glow="none" className="flex flex-col bg-[#050505] border-white/10 overflow-hidden relative p-0">
          <div className="p-4 border-b border-white/10 bg-[#020202] flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-foreground/50" />
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">Target Environment: Blog Comments</span>
          </div>

          <div className="flex-1 p-8 overflow-y-auto bg-slate-950 flex items-start justify-center">
             <div className="w-full max-w-md bg-[#020617] rounded shadow-xl overflow-hidden h-[450px]">
                <iframe
                  ref={iframeRef}
                  srcDoc={getIframeSrcDoc()}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
             </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
