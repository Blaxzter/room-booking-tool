#!/bin/bash

echo "🚀 Starting Room Booking Tool setup..."

# Download the setup script if being run via curl
SCRIPT_PATH="$0"
if [[ "$SCRIPT_PATH" == "bash" ]]; then
    echo "📥 Downloading setup script..."
    curl -s -o setup.sh https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/setup.sh
    chmod +x setup.sh
fi

# Parse command line arguments
SETUP_TELEGRAM=false
for arg in "$@"; do
    case $arg in
        --telegram)
            SETUP_TELEGRAM=true
            shift
            ;;
    esac
done

# Download docker-compose file if it doesn't exist
if [ ! -f "docker-compose.yml" ]; then
    echo "📥 Downloading docker-compose.yml..."
    if ! curl -s -o docker-compose.yml https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/docker-compose.yml; then
        echo "❌ Failed to download docker-compose.yml"
        exit 1
    fi
fi

# Load configuration files
if [ ! -f "./config.env" ]; then
    echo "📥 Downloading config.env..."
    if ! curl -s -o config.env https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/config.env; then
        echo "❌ Failed to download config.env"
        exit 1
    fi
fi

if [ ! -f "./.env" ]; then
    echo "📥 Downloading .env.example..."
    if ! curl -s -o .env https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/.env.example; then
        echo "❌ Failed to download .env.example"
        exit 1
    fi
fi

# Load configurations
sed -i 's/\r$//' config.env
source ./config.env
sed -i 's/\r$//' .env
source ./.env

# Handle Telegram setup if --telegram flag is used
if [ "$SETUP_TELEGRAM" = true ]; then
    echo "🤖 Setting up Telegram bot..."
    echo "Please enter your Telegram Bot Token:"
    read -r telegram_token

    # Update .env file with Telegram token
    if grep -q "TELEGRAM_BOT_TOKEN=" .env; then
        sed -i "s|TELEGRAM_BOT_TOKEN=.*|TELEGRAM_BOT_TOKEN=$telegram_token|" .env
    else
        echo "TELEGRAM_BOT_TOKEN=$telegram_token" >> .env
    fi

    COMPOSE_CMD="docker-compose --profile telegram up -d"
else
    COMPOSE_CMD="docker-compose up -d"
fi


# Check if containers are already running
if docker-compose ps | grep -q "directus"; then
    echo "🔍 Found existing containers running..."
    running_status=$(docker inspect --format='{{.State.Running}}' $(docker-compose ps -q directus))
    if [ "$running_status" = "true" ]; then
        echo "✅ Containers are already running, skipping docker-compose up"
    else
        echo "⚠️ Containers exist but not running, starting them..."
        if ! $COMPOSE_CMD; then
            echo "❌ Failed to start containers"
            echo "💡 Try running 'docker-compose logs' to see what's wrong"
            exit 1
        fi
        echo "✅ Containers started successfully"
    fi
else
    # Start containers in detached mode
    echo "🐳 Starting Docker containers..."
    if ! $COMPOSE_CMD; then
        echo "❌ Failed to start containers"
        echo "💡 Try running 'docker-compose logs' to see what's wrong"
        exit 1
    fi
    echo "✅ Containers started successfully"
fi

# Define the HOST_URL variable
HOST_URL="http://localhost:${BACKEND_PUBLIC_PORT}"

echo "⏳ Waiting for Directus to be available... ($HOST_URL)"
attempts=0
max_attempts=10

until $(curl --output /dev/null --silent --head --fail "$HOST_URL/server/ping"); do
    attempts=$((attempts + 1))
    if [ $attempts -eq $max_attempts ]; then
        echo "❌ Timeout waiting for Directus to start after $max_attempts attempts"
        echo "💡 Try running 'docker-compose logs' to see what's wrong"
        exit 1
    fi
    printf "Attempt $attempts of $max_attempts...\n"
    sleep 5
done

echo "✅ Directus is up, obtaining authentication token..."

TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email": "'"$ADMIN_EMAIL"'", "password": "'"$ADMIN_PASSWORD"'"}' \
  "$HOST_URL/auth/login" | jq -r '.data.access_token')

# Check if initialization is needed
COLLECTION_EXISTS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "$HOST_URL/collections/bookable_object" | jq -r '.data')

if [ "$COLLECTION_EXISTS" = "null" ]; then
    echo "🔧 Initialization needed, running directus-sync push in container..."
    if ! docker-compose exec -T directus npx --yes directus-sync@2.2.0 push -u "http://127.0.0.1:8055" -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" -d "/directus/schema"; then
        echo "❌ Schema initialization failed"
        echo "💡 Try running 'docker-compose logs directus' to see what's wrong"
        exit 1
    fi
    echo "✅ Schema initialization complete!"
fi

# Configure system settings (runs every time)
echo "⚙️  Configuring system settings..."
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{
    \"public_registration_verify_email\": $REQUIRE_EMAIL_VERIFICATION
  }" \
  "$HOST_URL/settings" -o /dev/null

# Update data model settings (runs every time)
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{
    \"display_legal\": $DISPLAY_LEGAL,
    \"require_email_verification\": $REQUIRE_EMAIL_VERIFICATION,
    \"no_user_mode\": $NO_USER_MODE,
    \"show_buy_me_a_coffee\": $SHOW_BUY_ME_A_COFFEE
  }" \
  "$HOST_URL/items/settings" -o /dev/null

# Handle role assignment (runs every time)
if [ "$DEMO_MODE" = "true" ]; then
    echo "🎮 Demo mode is enabled, setting user role to 'demo'"
    ROLE_FILTER="DemoUser"
else
    echo "👥 Demo mode is disabled, setting user role to 'Member'"
    ROLE_FILTER="Member"
fi

ROLE_FILTER_ENCODED=$(printf 'filter[name][_eq]=%s' "$ROLE_FILTER" | sed 's/\[/%5B/g; s/\]/%5D/g')
ROLE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
          "$HOST_URL/roles?fields=id&$ROLE_FILTER_ENCODED")
ROLE_ID=$(echo "$ROLE_RESPONSE" | jq -r '.data[0].id')

if [ -z "$ROLE_ID" ] || [ "$ROLE_ID" = "null" ]; then
    echo "❌ Role '$ROLE_FILTER' not found. Please ensure the role exists."
    exit 1
fi

echo "👤 Setting public registration role to: $ROLE_ID"
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"public_registration_role\": \"$ROLE_ID\"}" \
  "$HOST_URL/settings" -o /dev/null

echo "🎉 Setup completed successfully!"
echo
echo "📱 Frontend is now accessible at: http://localhost:${FRONTEND_PUBLIC_PORT}"
echo "⚙️ Directus is available at: http://localhost:${BACKEND_PUBLIC_PORT}"
echo
echo "💡 To set up Telegram notifications: "
echo "1. Visit https://github.com/Blaxzter/room-booking-tool#telegram-bot-setup for instructions"
echo "2. After setting the environment variables run: ./setup.sh --telegram"
