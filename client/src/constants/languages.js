/**
 * languages.js — Supported language configurations
 * pistonLang: Language ID used by Piston API
 * pistonVersion: Version of the language used by Piston API
 * monacoLang: Monaco Editor language identifier
 */

export const LANGUAGES = [
  {
    id: 'javascript',
    label: '🟨 JavaScript',
    pistonLang: 'javascript',
    pistonVersion: '18.15.0',
    judge0Id: 63,
    jdoodleLang: 'nodejs',
    jdoodleVer: '4', // Node.js 17+
    monacoLang: 'javascript',
    defaultCode: 'console.log("Hello, TANDEM!");\n',
  },
  {
    id: 'python',
    label: '🐍 Python',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    judge0Id: 71,
    jdoodleLang: 'python3',
    jdoodleVer: '4', // Python 3.9+
    monacoLang: 'python',
    defaultCode: 'print("Hello, TANDEM!")\n',
  },
  {
    id: 'cpp',
    label: '⚡ C++',
    pistonLang: 'c++',
    pistonVersion: '10.2.0',
    judge0Id: 54,
    jdoodleLang: 'cpp',
    jdoodleVer: '5', // C++ 17 GCC 9
    monacoLang: 'cpp',
    defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, TANDEM!" << endl;\n  return 0;\n}\n',
  },
  {
    id: 'java',
    label: '☕ Java',
    pistonLang: 'java',
    pistonVersion: '15.0.2',
    judge0Id: 62,
    jdoodleLang: 'java',
    jdoodleVer: '4', // JDK 17
    monacoLang: 'java',
    defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, TANDEM!");\n  }\n}\n',
  },
  {
    id: 'typescript',
    label: '🔷 TypeScript',
    pistonLang: 'typescript',
    pistonVersion: '5.0.3',
    judge0Id: 74,
    jdoodleLang: 'nodejs', // JDoodle doesn't natively support TS, we could transpile but we'll try running as JS via node if needed, or it might fail.
    jdoodleVer: '4',
    monacoLang: 'typescript',
    defaultCode: 'const greet = (name: string): void => {\n  console.log(`Hello, ${name}!`);\n};\ngreet("TANDEM");\n',
  },
  {
    id: 'go',
    label: '🐹 Go',
    pistonLang: 'go',
    pistonVersion: '1.16.2',
    judge0Id: 60,
    jdoodleLang: 'go',
    jdoodleVer: '4', // Go 1.17 
    monacoLang: 'go',
    defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, TANDEM!")\n}\n',
  },
  {
    id: 'rust',
    label: '🦀 Rust',
    pistonLang: 'rust',
    pistonVersion: '1.68.2',
    judge0Id: 73,
    jdoodleLang: 'rust',
    jdoodleVer: '4', // Rust 1.58
    monacoLang: 'rust',
    defaultCode: 'fn main() {\n  println!("Hello, TANDEM!");\n}\n',
  },
  {
    id: 'c',
    label: '🔵 C',
    pistonLang: 'c',
    pistonVersion: '10.2.0',
    judge0Id: 50,
    jdoodleLang: 'c',
    jdoodleVer: '5', // C GCC 9
    monacoLang: 'c',
    defaultCode: '#include <stdio.h>\n\nint main() {\n  printf("Hello, TANDEM!\\n");\n  return 0;\n}\n',
  },
];

export const LANGUAGE_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));
