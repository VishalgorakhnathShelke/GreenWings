import json

log_path = r'C:\Users\Vishal\.gemini\antigravity\brain\e7001022-fef1-46ed-8dca-fde572a2a04e\.system_generated\logs\transcript_full.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'produce_202606291941.csv' in line and 'def safe_name(' in line:
            data = json.loads(line)
            content = data.get('content', '')
            if 'Showing lines 1 to 323' in content or 'Showing lines 1 to ' in content:
                # Extract the source code by removing line numbers
                code_lines = []
                for cl in content.split('\n'):
                    import re
                    m = re.match(r'^(\d+):\s(.*)$', cl)
                    if m:
                        code_lines.append(m.group(2))
                
                with open(r'C:\Users\Vishal\Documents\Codex\2026-06-13\greenwings-react\database\sps\main.py', 'w', encoding='utf-8') as out:
                    out.write('\n'.join(code_lines))
                print("Successfully restored FULL main.py!")
                break
