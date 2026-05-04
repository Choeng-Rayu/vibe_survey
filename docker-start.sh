#!/bin/bash

# =============================================================================
# Vibe Survey - Docker Startup Script
# Three-sided marketplace: Survey-as-Ads platform
# =============================================================================

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# =============================================================================
# Helper Functions
# =============================================================================

print_banner() {
    echo -e "${CYAN}"
    echo -e "╔══════════════════════════════════════════════════════════════════╗"
    echo -e "║                                                                  ║"
    echo -e "║     ${BOLD}██╗   ██╗██╗██████╗ ███████╗    ███████╗██╗   ██╗██████╗ ██╗   ██╗███████╗██╗   ██╗${NC}${CYAN}     ║"
    echo -e "║     ${BOLD}██║   ██║██║██╔══██╗██╔════╝    ██╔════╝██║   ██║██╔══██╗██║   ██║██╔════╝╚██╗ ██╔╝${NC}${CYAN}     ║"
    echo -e "║     ${BOLD}██║   ██║██║██████╔╝█████╗      ███████╗██║   ██║██████╔╝██║   ██║█████╗   ╚████╔╝ ${NC}${CYAN}     ║"
    echo -e "║     ${BOLD}╚██╗ ██╔╝██║██╔══██╗██╔══╝      ╚════██║██║   ██║██╔══██╗██║   ██║██╔══╝    ╚██╔╝  ${NC}${CYAN}     ║"
    echo -e "║     ${BOLD} ╚████╔╝ ██║██████╔╝███████╗    ███████║╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║   ${NC}${CYAN}     ║"
    echo -e "║     ${BOLD}  ╚═══╝  ╚═╝╚═════╝ ╚══════╝    ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ${NC}${CYAN}     ║"
    echo -e "║                                                                  ║"
    echo -e "║              ${MAGENTA}${BOLD}Docker Startup - Three-Sided Marketplace${NC}${CYAN}              ║"
    echo -e "║                                                                  ║"
    echo -e "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header() {
    echo -e "${CYAN}${BOLD}$1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' $(seq 1 $((${#1}+1))))${NC}"
}

# =============================================================================
# Prerequisites Check
# =============================================================================

check_docker() {
    print_header "Checking Prerequisites"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo -e "   Visit: ${CYAN}https://docs.docker.com/get-docker/${NC}"
        exit 1
    fi

    DOCKER_VERSION=$(docker --version 2>/dev/null | cut -d ' ' -f 3 | cut -d ',' -f 1)
    print_success "Docker installed: ${BOLD}$DOCKER_VERSION${NC}"

    # Check Docker Compose
    if docker compose version &> /dev/null; then
        COMPOSE_VERSION=$(docker compose version --short 2>/dev/null)
        print_success "Docker Compose (plugin) installed: ${BOLD}$COMPOSE_VERSION${NC}"
        COMPOSE_CMD="docker compose"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version 2>/dev/null | cut -d ' ' -f 3 | cut -d ',' -f 1)
        print_success "Docker Compose (standalone) installed: ${BOLD}$COMPOSE_VERSION${NC}"
        COMPOSE_CMD="docker-compose"
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        echo -e "   Visit: ${CYAN}https://docs.docker.com/compose/install/${NC}"
        exit 1
    fi

    # Check if docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi

    print_success "Docker daemon is running"
    echo ""
}

# =============================================================================
# Service Information
# =============================================================================

show_services() {
    print_header "Services Overview"

    echo -e "${CYAN}┌─────────────────────────────┬────────────────────────────────────────┬──────────┐${NC}"
    echo -e "${CYAN}│${NC} ${BOLD}Service${NC}                     ${CYAN}│${NC} ${BOLD}Description${NC}                            ${CYAN}│${NC} ${BOLD}Port${NC}     ${CYAN}│${NC}"
    echo -e "${CYAN}├─────────────────────────────┼────────────────────────────────────────┼──────────┤${NC}"
    echo -e "${CYAN}│${NC} ${GREEN}backend${NC}                     ${CYAN}│${NC} NestJS API Server                      ${CYAN}│${NC} ${MAGENTA}3000${NC}     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} ${GREEN}survey-creator${NC}              ${CYAN}│${NC} Advertiser Portal (Next.js 16)         ${CYAN}│${NC} ${MAGENTA}3001${NC}     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} ${GREEN}survey-taker${NC}                ${CYAN}│${NC} User Survey App (Next.js 16)           ${CYAN}│${NC} ${MAGENTA}3002${NC}     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} ${GREEN}admin${NC}                       ${CYAN}│${NC} Admin Dashboard (Next.js 16)           ${CYAN}│${NC} ${MAGENTA}3003${NC}     ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────┴────────────────────────────────────────┴──────────┘${NC}"
    echo ""
}

# =============================================================================
# Mode Selection
# =============================================================================

select_mode() {
    print_header "Select Startup Mode"

    echo -e "${CYAN}[1]${NC} ${BOLD}Production Mode${NC}"
    echo -e "    • Uses: ${YELLOW}docker-compose up --build -d${NC}"
    echo -e "    • Optimized builds with production settings"
    echo -e "    • No hot reload, optimized for performance"
    echo -e ""
    echo -e "${CYAN}[2]${NC} ${BOLD}Development Mode${NC}"
    echo -e "    • Uses: ${YELLOW}docker-compose with override file${NC}"
    echo -e "    • Hot reload enabled for all services"
    echo -e "    • Source code mounted as volumes"
    echo -e "    • Debug-friendly configuration"
    echo -e ""

    while true; do
        read -p "Enter your choice (1 or 2): " choice

        case $choice in
            1)
                echo ""
                print_info "Selected: ${BOLD}Production Mode${NC}"
                MODE="production"
                COMPOSE_ARGS="up --build -d"
                return
                ;;
            2)
                echo ""
                print_info "Selected: ${BOLD}Development Mode${NC}"
                MODE="development"

                # Check if override file exists
                if [ -f "docker-compose.override.yml" ]; then
                    COMPOSE_ARGS="-f docker-compose.yml -f docker-compose.override.yml up --build -d"
                else
                    print_warning "docker-compose.override.yml not found!"
                    print_info "Falling back to production mode..."
                    COMPOSE_ARGS="up --build -d"
                    MODE="production"
                fi
                return
                ;;
            *)
                print_error "Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
}

# =============================================================================
# Start Services
# =============================================================================

start_services() {
    echo ""
    print_header "Starting Services ($MODE Mode)"

    print_info "Building and starting containers..."
    echo -e "${YELLOW}Command: $COMPOSE_CMD $COMPOSE_ARGS${NC}"
    echo ""

    if ! $COMPOSE_CMD $COMPOSE_ARGS; then
        echo ""
        print_error "Failed to start services. Check the logs above for errors."
        exit 1
    fi

    echo ""
    print_success "All services started successfully!"
    echo ""
}

# =============================================================================
# Display URLs and Info
# =============================================================================

show_urls() {
    print_header "Access URLs"

    echo -e "${CYAN}┌──────────────────────────────┬─────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC} ${BOLD}Service${NC}                      ${CYAN}│${NC} ${BOLD}URL${NC}                                         ${CYAN}│${NC}"
    echo -e "${CYAN}├──────────────────────────────┼─────────────────────────────────────────────┤${NC}"
    echo -e "${CYAN}│${NC} Backend API                  ${CYAN}│${NC} ${CYAN}http://localhost:${MAGENTA}3000${NC}${CYAN}${NC}                        ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} Survey Creator (Advertiser)  ${CYAN}│${NC} ${CYAN}http://localhost:${MAGENTA}3001${NC}${CYAN}${NC}                        ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} Survey Taker (User App)      ${CYAN}│${NC} ${CYAN}http://localhost:${MAGENTA}3002${NC}${NC}                        ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} Admin Dashboard              ${CYAN}│${NC} ${CYAN}http://localhost:${MAGENTA}3003${NC}${NC}                        ${CYAN}│${NC}"
    echo -e "${CYAN}└──────────────────────────────┴─────────────────────────────────────────────┘${NC}"
    echo ""
}

show_health_check() {
    print_info "Waiting for services to be ready..."
    echo ""

    # Give services a moment to start
    sleep 3

    # Check health of each service
    local retries=5
    local wait_time=5

    echo -e "${CYAN}Service Health Check:${NC}"

    for service in backend:3000 survey-creator:3001 survey-taker:3002 admin:3003; do
        local name=$(echo $service | cut -d: -f1)
        local port=$(echo $service | cut -d: -f2)
        local url="http://localhost:$port"

        # Try to connect to the service
        local attempt=1
        local healthy=false

        while [ $attempt -le $retries ]; do
            if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -qE "(200|404)" 2>/dev/null; then
                print_success "$name is responding on port $port"
                healthy=true
                break
            fi
            sleep $wait_time
            ((attempt++))
        done

        if [ "$healthy" = false ]; then
            print_warning "$name may still be starting (port $port)"
        fi
    done

    echo ""
}

# =============================================================================
# Show Commands
# =============================================================================

show_commands() {
    print_header "Useful Commands"

    echo -e "${CYAN}View Logs:${NC}"
    echo -e "  ${YELLOW}# All services${NC}"
    echo -e "  $COMPOSE_CMD logs -f"
    echo -e ""
    echo -e "  ${YELLOW}# Specific service${NC}"
    echo -e "  $COMPOSE_CMD logs -f backend"
    echo -e "  $COMPOSE_CMD logs -f survey-creator"
    echo -e "  $COMPOSE_CMD logs -f survey-taker"
    echo -e "  $COMPOSE_CMD logs -f admin"
    echo -e ""

    echo -e "${CYAN}Stop Services:${NC}"
    echo -e "  ${YELLOW}# Stop all services${NC}"
    echo -e "  $COMPOSE_CMD down"
    echo -e ""
    echo -e "  ${YELLOW}# Stop and remove volumes${NC}"
    echo -e "  $COMPOSE_CMD down -v"
    echo -e ""

    echo -e "${CYAN}Restart Services:${NC}"
    echo -e "  $COMPOSE_CMD restart <service_name>"
    echo -e ""

    echo -e "${CYAN}Check Status:${NC}"
    echo -e "  $COMPOSE_CMD ps"
    echo -e ""

    echo -e "${CYAN}Rebuild Specific Service:${NC}"
    echo -e "  $COMPOSE_CMD up --build -d <service_name>"
    echo -e ""
}

# =============================================================================
# Main Script
# =============================================================================

main() {
    # Clear screen (optional, for cleaner output)
    # clear

    print_banner
    check_docker
    show_services
    select_mode
    start_services
    show_urls
    show_health_check
    show_commands

    print_header "Startup Complete"
    print_success "Vibe Survey platform is running!"
    echo ""
    print_info "Open ${BOLD}http://localhost:3001${NC} to access the Survey Creator (Advertiser Portal)"
    echo ""
}

# Run main function
main "$@"
