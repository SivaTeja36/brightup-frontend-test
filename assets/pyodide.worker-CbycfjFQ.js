(function(){"use strict";const d=self;let e=null;const n=o=>d.postMessage(o);d.onmessage=async o=>{const r=o.data;if(r.type==="init"){try{const t=r.indexURL;e=await(await import(`${t}pyodide.mjs`)).loadPyodide({indexURL:t}),n({type:"ready",version:e.version})}catch(t){n({type:"error",message:`Could not load the Python runtime: ${t.message??String(t)}`})}return}if(r.type==="run"){if(!e){n({type:"error",message:"Python runtime is not ready yet."});return}const t=(r.stdin??"").replace(/\r\n/g,`
`).split(`
`);t.length&&t[t.length-1]===""&&t.pop();let a=0;e.setStdin({stdin:()=>a<t.length?`${t[a++]}
`:null,isatty:!1}),e.setStdout({batched:s=>n({type:"stdout",text:`${s}
`})}),e.setStderr({batched:s=>n({type:"stderr",text:`${s}
`})});const l=performance.now();let c=!0;try{await e.runPythonAsync(r.code??"")}catch(s){c=!1;const i=s.message??String(s),y=i.indexOf("Traceback");n({type:"stderr",text:`${y>=0?i.slice(y):i}
`})}n({type:"done",ok:c,durationMs:Math.round(performance.now()-l)})}}})();
