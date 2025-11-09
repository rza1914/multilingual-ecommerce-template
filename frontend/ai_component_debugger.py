#!/usr/bin/env python3
"""
AI Component Debugger for Frontend
This script analyzes the frontend for AI-related components, imports, and routes.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple
import json

class AIComponentDebugger:
    def __init__(self, frontend_path: str = "./frontend"):
        self.frontend_path = Path(frontend_path)
        self.src_path = self.frontend_path / "src"
        self.ai_patterns = [
            r'ai', r'artificial.*intelligence', r'chat', r'chatgpt', r'openai',
            r'gpt', r'gemini', r'claude', r'assistant', r'bot', r'conversation',
            r'nlp', r'natural.*language', r'analysis', r'analyzer', r'recommend',
            r'recommendation', r'smart', r'intelligent', r'cognitive', r'neural',
            r'generator', r'completion', r'embedding', r'embedding', r'semantic',
            r'context', r'contextual', r'personaliz', r'customiz', r'adaptive',
            r'learning', r'predict', r'prediction', r'generation', r'generate',
            r'image.*search', r'visual.*search', r'ocr', r'vision', r'language.*model',
            r'langchain', r'hugging', r'transform', r'embed', r'vector', r'similarity'
        ]
        self.ai_import_patterns = [
            r'@dqbd/tiktoken', r'tiktoken', r'openai', r'@langchain', r'langchain',
            r'axios', r'open-ai', r'gpt', r'gemini', r'claude', r'@xenova'
        ]
        
    def find_ai_related_files(self) -> List[Dict]:
        """Find all files that contain AI-related patterns"""
        ai_files = []
        for file_path in self.src_path.rglob("*.{tsx,ts,jsx,js}"):
            if file_path.is_file():
                content = file_path.read_text(encoding='utf-8', errors='ignore')
                matches = []
                for pattern in self.ai_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        matches.append(pattern)
                if matches:
                    ai_files.append({
                        'file': str(file_path.relative_to(self.frontend_path)),
                        'matches': matches,
                        'content_preview': content[:200] + "..." if len(content) > 200 else content
                    })
        return ai_files

    def analyze_imports(self, file_path: Path) -> List[str]:
        """Extract import statements from a file"""
        content = file_path.read_text(encoding='utf-8', errors='ignore')
        import_pattern = r'import\s+.*?from\s+[\'"](.*)[\'"]|import\s+[\'"](.*)[\'"]'
        imports = re.findall(import_pattern, content)
        # Flatten the tuple results and remove None values
        flat_imports = []
        for imp in imports:
            for item in imp:
                if item:
                    flat_imports.append(item)
        return flat_imports

    def check_main_imports(self) -> Dict:
        """Check import statements in main files like App.tsx, main.tsx"""
        main_files = [
            self.src_path / "App.tsx",
            self.src_path / "main.tsx"
        ]
        
        main_imports = {}
        for file_path in main_files:
            if file_path.exists():
                main_imports[str(file_path.name)] = self.analyze_imports(file_path)
        return main_imports

    def find_routes(self) -> List[Dict]:
        """Find route definitions in the application"""
        routes = []
        app_tsx = self.src_path / "App.tsx"
        if app_tsx.exists():
            content = app_tsx.read_text(encoding='utf-8', errors='ignore')
            # Look for React Router patterns
            route_pattern = r'<Route\s+path=[\'"]([^\'"]*)[\'"]\s+element={[^}]*\s*(\w+Component|\w+Page)'
            route_matches = re.findall(route_pattern, content, re.IGNORECASE)
            for path, component in route_matches:
                routes.append({
                    'path': path,
                    'component': component
                })
        return routes

    def find_ai_components(self) -> List[Dict]:
        """Find components that seem to be AI-related based on name or content"""
        ai_components = []
        for file_path in self.src_path.rglob("*.{tsx,ts,jsx,js}"):
            if file_path.is_file():
                content = file_path.read_text(encoding='utf-8', errors='ignore')
                
                # Check if filename suggests AI functionality
                filename_ai_indicators = [
                    'chat', 'assistant', 'recommend', 'smart', 'ai', 'bot', 
                    'analysis', 'generator', 'suggest', 'image.*search', 'visual'
                ]
                
                filename_match = False
                for indicator in filename_ai_indicators:
                    if re.search(indicator, file_path.name, re.IGNORECASE):
                        filename_match = True
                        break
                
                # Check content for AI-related patterns
                content_match = False
                for pattern in self.ai_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        content_match = True
                        break
                
                if filename_match or content_match:
                    ai_components.append({
                        'file': str(file_path.relative_to(self.frontend_path)),
                        'name': file_path.stem,
                        'type': 'filename_match' if filename_match else 'content_match',
                        'uses_backend_api': 'fetch' in content or 'axios' in content.lower() or 'api' in content.lower()
                    })
        
        return ai_components

    def analyze_ai_services(self) -> List[Dict]:
        """Analyze service files for AI-related functionality"""
        ai_services = []
        services_path = self.src_path / "services"
        if services_path.exists():
            for file_path in services_path.rglob("*.ts"):
                if file_path.is_file():
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                    ai_indicators = []
                    for pattern in self.ai_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            ai_indicators.append(pattern)
                    
                    if ai_indicators:
                        ai_services.append({
                            'file': str(file_path.relative_to(self.frontend_path)),
                            'indicators': ai_indicators,
                            'content_preview': content[:300] + "..." if len(content) > 300 else content
                        })
        return ai_services

    def run_full_analysis(self) -> Dict:
        """Run complete analysis and return results"""
        print("Starting AI Component Analysis...")
        
        results = {
            'ai_related_files': self.find_ai_related_files(),
            'main_imports': self.check_main_imports(),
            'routes': self.find_routes(),
            'ai_components': self.find_ai_components(),
            'ai_services': self.analyze_ai_services()
        }
        
        return results

    def print_analysis_report(self, results: Dict):
        """Print formatted analysis report"""
        print("\n" + "="*60)
        print("AI COMPONENT ANALYSIS REPORT")
        print("="*60)
        
        print(f"\nAI-Related Files Found: {len(results['ai_related_files'])}")
        for file_info in results['ai_related_files']:
            print(f"  - {file_info['file']}")
            print(f"    Matches: {', '.join(file_info['matches'])}")
        
        print(f"\nMain File Imports:")
        for file_name, imports in results['main_imports'].items():
            print(f"  {file_name}:")
            for imp in imports:
                print(f"    - {imp}")
        
        print(f"\nRoutes Found: {len(results['routes'])}")
        for route in results['routes']:
            print(f"  - {route['path']} -> {route['component']}")
        
        print(f"\nAI Components Identified: {len(results['ai_components'])}")
        for comp in results['ai_components']:
            backend_api = " (uses backend API)" if comp['uses_backend_api'] else ""
            print(f"  - {comp['name']} ({comp['type']}){backend_api}")
        
        print(f"\nAI Services Found: {len(results['ai_services'])}")
        for service in results['ai_services']:
            print(f"  - {service['file']}")
            print(f"    Indicators: {', '.join(service['indicators'])}")
        
        print("\n" + "="*60)
        print("Analysis Complete")
        print("="*60)

if __name__ == "__main__":
    debugger = AIComponentDebugger("../")
    results = debugger.run_full_analysis()
    debugger.print_analysis_report(results)