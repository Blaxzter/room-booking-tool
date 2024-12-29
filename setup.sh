#!/bin/bash

echo "🚀 Starting Room Booking Tool setup..."

# Download docker-compose file if it doesn't exist
if [ ! -f "docker-compose.yml" ]; then
    echo "📥 Downloading docker-compose.yml..."
    curl -o docker-compose.yml https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/docker-compose.yml
fi

# Load configuration from config file
if [ ! -f "./config.env" ]; then
    echo "📥 Downloading config.env..."
    curl -o config.env https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/config.env
fi

# Load configuration from config file
if [ ! -f "./.env" ]; then
    echo "📥 Downloading .env.example..."
    curl -o config.env https://raw.githubusercontent.com/Blaxzter/room-booking-tool/refs/heads/main/.env.example

    # Rename .env.example to .env
    mv .env.example .env
fi

# Load configuration from config file
sed -i 's/\r$//' config.env
source ./config.env

# Also load configuration from .env file
sed -i 's/\r$//' .env
source ./.env

# Check if containers are already running
if docker-compose ps | grep -q "directus"; then
    echo "🔍 Found existing containers running..."
    running_status=$(docker inspect --format='{{.State.Running}}' $(docker-compose ps -q directus))
    if [ "$running_status" = "true" ]; then
        echo "✅ Containers are already running, skipping docker-compose up"
    else
        echo "⚠️ Containers exist but not running, starting them..."
        docker-compose up -d
    fi
else
    # Start containers in detached mode
    echo "🐳 Starting Docker containers..."
    docker-compose up -d
fi

# Define the HOST_URL variable
HOST_URL="http://localhost:${BACKEND_PUBLIC_PORT}"

echo "⏳ Waiting for Directus to be available... ($HOST_URL)"
attempts=0
max_attempts=10

until $(curl --output /dev/null --silent --head --fail "$HOST_URL/server/health"); do
    attempts=$((attempts + 1))
    if [ $attempts -eq $max_attempts ]; then
        echo "❌ Timeout waiting for Directus to start after $max_attempts attempts"
        echo "💡 Try running 'docker-compose logs' to see what's wrong"
        exit 1
    fi
    printf "Attempt $attempts of $max_attempts..."
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
    echo "🔧 Initialization needed, running directus-sync push..."
    npx directus-sync@2.2.0 push -u "$HOST_URL" -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"
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
