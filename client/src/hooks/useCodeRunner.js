import { useState, useCallback } from 'react';
import { LANGUAGES } from '../constants/languages.js';

const JUDGE0_URL = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = import.meta.env.VITE_JUDGE0_API_KEY || '';

const POLL_INTERVAL_MS = 1000;
const MAX_POLLS = 15;

/**
 * useCodeRunner.js — Judge0 API integration for code execution
 * Flow: submit code → poll for result → return output/error
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
      // Submit code to Judge0
      const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: langConfig.judge0Id,
          stdin: '',
        }),
      });

      const { token } = await submitRes.json();
      if (!token) throw new Error('No token received from Judge0');

      // Poll for result
      let polls = 0;
      const pollResult = async () => {
        polls++;
        const res = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`, {
          headers: {
            'X-RapidAPI-Key': JUDGE0_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        });
        const data = await res.json();

        if (data.status?.id <= 2 && polls < MAX_POLLS) {
          // Still processing (In Queue / Processing)
          setTimeout(pollResult, POLL_INTERVAL_MS);
          return;
        }

        const result =
          data.stdout || data.stderr || data.compile_output || '(No output)';
        setOutput(result);
        setIsRunning(false);
      };

      setTimeout(pollResult, POLL_INTERVAL_MS);
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
      setIsRunning(false);
    }
  }, []);

  return { output, isRunning, runCode };
}
