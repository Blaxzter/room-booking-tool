#!/bin/sh

echo "Waiting for Directus to be available..."
until $(curl --output /dev/null --silent --head --fail http://directus:8055/server/health); do
    printf '.'
    sleep 5
done

echo "Directus is up, checking if initialization is needed..."

TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email": "'"$ADMIN_EMAIL"'", "password": "'"$ADMIN_PASSWORD"'"}' \
  http://directus:8055/auth/login | jq -r '.data.access_token')

# Check if a specific collection exists to determine if initialization is needed
COLLECTION_EXISTS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://directus:8055/collections/bookable_object | jq -r '.data')

if [ "$COLLECTION_EXISTS" = "null" ]; then
    echo "Initialization needed, running directus-sync push..."

    # Run directus-sync push to sync your schema and data
    npx directus-sync push -u http://directus:8055 -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"

    # Check if DEMO_MODE is enabled
    if [ "$DEMO_MODE" = "true" ]; then
        echo "Demo mode is enabled, setting initial user role to 'demo'"

        # Obtain an admin access token
        TOKEN=$(curl -s -X POST -d "email=$ADMIN_EMAIL&password=$ADMIN_PASSWORD" http://directus:8055/auth/login | jq -r '.data.access_token')

        # Replace 'demo_role_id' with your actual demo role ID
        DEMO_ROLE_ID='demo_role_id'
        USER_ID=1  # Replace with the actual user ID

        # Update the user's role to 'demo'
        curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
          -d '{"role": "'$DEMO_ROLE_ID'"}' \
          http://directus:8055/users/$USER_ID
    fi

    echo "Initialization complete."
else
    echo "Initialization already done, skipping."
fi
