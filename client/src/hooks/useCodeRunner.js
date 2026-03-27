import { useState, useCallback } from 'react';
import { LANGUAGES } from '../constants/languages.js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

/**
 * useCodeRunner.js — Code execution using our Backend Proxy (handles JDoodle & Judge0 safely)
 * Flow: submit code via backend proxy → await result → return output/error
 */
export function useCodeRunner() {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async (code, language) => {
    setIsRunning(true);
    setOutput('');

    const langConfig = LANGUAGES.find((l) => l.id === language);
    if (!langConfig) {
      setOutput('❌ Unsupported language.');
      setIsRunning(false);
      return;
    }

    try {
      // Hit our Node backend to proxy execution requests safely
      const res = await fetch(`${SERVER_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          languageConfig: langConfig,
          engine: 'jdoodle', // Toggle this to 'judge0' in future if needed
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Execution API failed');
      }

      setOutput(data.output || '(No output)');
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { output, isRunning, runCode };
}
