#!/usr/bin/env python3
import os
import re
from datetime import datetime

# License header template
LICENSE_HEADER = """Copyright 2024 The Temporal Editioner Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

# File extensions and their comment styles
FILE_TYPES = {
    '.py': '#',
    '.js': '//',
    '.jsx': '//',
    '.ts': '//',
    '.tsx': '//',
    '.css': '/*',
    '.scss': '/*',
    '.html': '<!--',
    '.sh': '#',
    '.yml': '#',
    '.yaml': '#',
    '.json': '//',
    '.md': '<!--'
}

def get_comment_style(file_path):
    _, ext = os.path.splitext(file_path)
    return FILE_TYPES.get(ext, '//')

def add_header_to_file(file_path):
    comment_style = get_comment_style(file_path)
    if not comment_style:
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if file already has license header
        if 'Licensed under the Apache License' in content:
            return False

        # Format header based on comment style
        if comment_style in ['//', '#']:
            header = '\n'.join(f'{comment_style} {line}' for line in LICENSE_HEADER.split('\n'))
        else:  # For /* and <!-- style comments
            header = f'{comment_style}\n{LICENSE_HEADER}\n{comment_style}-->\n' if comment_style == '<!--' else f'{comment_style}\n{LICENSE_HEADER}\n*/\n'

        # Add header to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(header + '\n\n' + content)

        return True
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return False

def process_directory(directory):
    modified_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if any(file.endswith(ext) for ext in FILE_TYPES.keys()):
                if add_header_to_file(file_path):
                    modified_files.append(file_path)
    return modified_files

def main():
    # Directories to process
    directories = [
        'src',
        'python',
        'scripts',
        'docs'
    ]

    all_modified = []
    for directory in directories:
        if os.path.exists(directory):
            modified = process_directory(directory)
            all_modified.extend(modified)

    print(f"\nModified {len(all_modified)} files:")
    for file in all_modified:
        print(f"- {file}")

if __name__ == '__main__':
    main() 