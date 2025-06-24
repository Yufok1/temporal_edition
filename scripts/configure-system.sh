#!/bin/bash

# Copyright 2024 The Temporal Editioner Contributors
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# System Configuration Script
# Helps configure the system for different operational modes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create .env file
create_env_file() {
    local mode=$1
    local env_file=".env.local"
    
    print_info "Creating environment configuration for mode: $mode"
    
    # Backup existing .env if it exists
    if [ -f "$env_file" ]; then
        cp "$env_file" "${env_file}.backup.$(date +%s)"
        print_warning "Existing .env.local backed up"
    fi
    
    # Create new .env file based on mode
    cat > "$env_file" << EOF
# Temporal Edition System Configuration
# Generated on $(date)
# Mode: $mode

EOF
    
    case $mode in
        "auricle-only")
            cat >> "$env_file" << EOF
# Auricle AI + Crypto Securities (Whale Operations Disassociated)
REACT_APP_WHALE_OPS_ENABLED=false
REACT_APP_AURICLE_AI_ENABLED=true
REACT_APP_CRYPTO_SECURITIES_ENABLED=true
REACT_APP_TEMPORAL_EDITING_ENABLED=true
REACT_APP_RIDDLER_DASHBOARD_ENABLED=true
EOF
            ;;
        "whale-only")
            cat >> "$env_file" << EOF
# Whale Operations Only
REACT_APP_WHALE_OPS_ENABLED=true
REACT_APP_AURICLE_AI_ENABLED=false
REACT_APP_CRYPTO_SECURITIES_ENABLED=false
REACT_APP_TEMPORAL_EDITING_ENABLED=true
REACT_APP_RIDDLER_DASHBOARD_ENABLED=false
EOF
            ;;
        "crypto-only")
            cat >> "$env_file" << EOF
# Crypto Securities + Temporal Only
REACT_APP_WHALE_OPS_ENABLED=false
REACT_APP_AURICLE_AI_ENABLED=false
REACT_APP_CRYPTO_SECURITIES_ENABLED=true
REACT_APP_TEMPORAL_EDITING_ENABLED=true
REACT_APP_RIDDLER_DASHBOARD_ENABLED=false
EOF
            ;;
        "development")
            cat >> "$env_file" << EOF
# Development Mode (All Systems Enabled)
REACT_APP_WHALE_OPS_ENABLED=true
REACT_APP_AURICLE_AI_ENABLED=true
REACT_APP_CRYPTO_SECURITIES_ENABLED=true
REACT_APP_TEMPORAL_EDITING_ENABLED=true
REACT_APP_RIDDLER_DASHBOARD_ENABLED=true
EOF
            ;;
        "minimal")
            cat >> "$env_file" << EOF
# Minimal Mode (Core Systems Only)
REACT_APP_WHALE_OPS_ENABLED=false
REACT_APP_AURICLE_AI_ENABLED=false
REACT_APP_CRYPTO_SECURITIES_ENABLED=false
REACT_APP_TEMPORAL_EDITING_ENABLED=true
REACT_APP_RIDDLER_DASHBOARD_ENABLED=false
EOF
            ;;
        *)
            print_error "Unknown mode: $mode"
            return 1
            ;;
    esac
    
    print_success "Environment file created: $env_file"
}

# Function to show current configuration
show_current_config() {
    print_info "Current system configuration:"
    echo
    
    local env_file=".env.local"
    if [ -f "$env_file" ]; then
        echo "Configuration from $env_file:"
        grep "REACT_APP_" "$env_file" | while read -r line; do
            if [[ $line == *"=true"* ]]; then
                echo -e "  ${GREEN}✓${NC} $line"
            elif [[ $line == *"=false"* ]]; then
                echo -e "  ${RED}✗${NC} $line"
            else
                echo -e "  ${YELLOW}?${NC} $line"
            fi
        done
    else
        echo "No local configuration found (.env.local)"
        echo "Using default configuration from src/config/features.ts"
    fi
    echo
}

# Function to validate configuration
validate_config() {
    print_info "Validating configuration..."
    
    # Check if required files exist
    local required_files=(
        "src/config/features.ts"
        "src/services/AuricleIntegrationService.ts"
        "src/components/AuricleInterface.tsx"
        "package.json"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file not found: $file"
            return 1
        fi
    done
    
    # Check if npm dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_warning "Node modules not found. Run 'npm install' first."
        return 1
    fi
    
    print_success "Configuration validation passed"
}

# Function to start the system
start_system() {
    local mode=$1
    
    print_info "Starting system in mode: $mode"
    
    # Validate first
    if ! validate_config; then
        print_error "Configuration validation failed"
        return 1
    fi
    
    # Create environment configuration
    create_env_file "$mode"
    
    # Start the development server
    print_info "Starting development server..."
    npm start
}

# Function to show help
show_help() {
    echo "System Configuration Script"
    echo "Usage: $0 [command] [options]"
    echo
    echo "Commands:"
    echo "  config <mode>     Configure system for specific mode"
    echo "  start <mode>      Configure and start system"
    echo "  status           Show current configuration"
    echo "  validate         Validate configuration"
    echo "  help             Show this help message"
    echo
    echo "Available modes:"
    echo "  auricle-only     Auricle AI + Crypto (Whale Ops Disassociated)"
    echo "  whale-only       Whale Operations Only"
    echo "  crypto-only      Crypto Securities + Temporal Only"
    echo "  development      All Systems Enabled"
    echo "  minimal          Core Systems Only"
    echo
    echo "Examples:"
    echo "  $0 config auricle-only"
    echo "  $0 start whale-only"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    "config")
        if [ -z "$2" ]; then
            print_error "Mode required for config command"
            show_help
            exit 1
        fi
        create_env_file "$2"
        ;;
    "start")
        if [ -z "$2" ]; then
            print_error "Mode required for start command"
            show_help
            exit 1
        fi
        start_system "$2"
        ;;
    "status")
        show_current_config
        ;;
    "validate")
        validate_config
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac