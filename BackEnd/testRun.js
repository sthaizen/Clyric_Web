import { runInJudge } from './src/judge/index.js';
import fs from 'fs';

async function testRuntime() {
  const results = {};
  
  console.log("Testing JS runner...");
  results.js = await runInJudge({ language: 'javascript', code: 'console.log("Hello JS");', stdin: '' });

  console.log("Testing Python runner...");
  results.py = await runInJudge({ language: 'python', code: 'print("Hello Python")', stdin: '' });

  console.log("Testing Java runner...");
  results.java = await runInJudge({ language: 'java', code: 'public class Main { public static void main(String[] args) { System.out.println("Hello Java!"); } }', stdin: '' });

  console.log("Testing C++ runner...");
  results.cpp = await runInJudge({ language: 'cpp', code: '#include <iostream>\nint main() { std::cout << "Hello C++!" << std::endl; return 0; }', stdin: '' });

  console.log("Testing C runner (WASM)...");
  results.c = await runInJudge({ language: 'c', code: '#include <stdio.h>\nint main() { printf("Hello C!\\n"); return 0; }', stdin: '' });

  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
  console.log("Results written to test_results.json");
}

testRuntime().catch(console.error);
