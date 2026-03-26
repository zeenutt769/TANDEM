/**
 * languages.js — Supported language configurations
 * judge0Id: Language ID used by Judge0 API
 * monacoLang: Monaco Editor language identifier
 */

export const LANGUAGES = [
  {
    id: 'javascript',
    label: '🟨 JavaScript',
    judge0Id: 63,
    monacoLang: 'javascript',
    defaultCode: 'console.log("Hello, TANDEM!");\n',
  },
  {
    id: 'python',
    label: '🐍 Python',
    judge0Id: 71,
    monacoLang: 'python',
    defaultCode: 'print("Hello, TANDEM!")\n',
  },
  {
    id: 'cpp',
    label: '⚡ C++',
    judge0Id: 54,
    monacoLang: 'cpp',
    defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, TANDEM!" << endl;\n  return 0;\n}\n',
  },
  {
    id: 'java',
    label: '☕ Java',
    judge0Id: 62,
    monacoLang: 'java',
    defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, TANDEM!");\n  }\n}\n',
  },
  {
    id: 'typescript',
    label: '🔷 TypeScript',
    judge0Id: 74,
    monacoLang: 'typescript',
    defaultCode: 'const greet = (name: string): void => {\n  console.log(`Hello, ${name}!`);\n};\ngreet("TANDEM");\n',
  },
  {
    id: 'go',
    label: '🐹 Go',
    judge0Id: 60,
    monacoLang: 'go',
    defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, TANDEM!")\n}\n',
  },
  {
    id: 'rust',
    label: '🦀 Rust',
    judge0Id: 73,
    monacoLang: 'rust',
    defaultCode: 'fn main() {\n  println!("Hello, TANDEM!");\n}\n',
  },
  {
    id: 'c',
    label: '🔵 C',
    judge0Id: 50,
    monacoLang: 'c',
    defaultCode: '#include <stdio.h>\n\nint main() {\n  printf("Hello, TANDEM!\\n");\n  return 0;\n}\n',
  },
];

export const LANGUAGE_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));
