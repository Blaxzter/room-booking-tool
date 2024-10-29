#!/bin/sh

# Define the HOST_URL variable; default to 'http://directus:8055' if not set
# HOST_URL=${HOST_URL:-http://localhost:8055}
HOST_URL=${HOST_URL:-http://directus:8055}

echo "Waiting for Directus to be available... ($HOST_URL)"
until $(curl --output /dev/null --silent --head --fail "$HOST_URL/server/health"); do
    printf '.'
    sleep 5
done

echo "Directus is up, checking if initialization is needed..."

TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email": "'"$ADMIN_EMAIL"'", "password": "'"$ADMIN_PASSWORD"'"}' \
  "$HOST_URL/auth/login" | jq -r '.data.access_token')

# Check if a specific collection exists to determine if initialization is needed
COLLECTION_EXISTS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "$HOST_URL/collections/bookable_object" | jq -r '.data')

if [ "$COLLECTION_EXISTS" = "null" ]; then
    echo "Initialization needed, running directus-sync push..."

    # Run directus-sync push to sync your schema and data
    npx directus-sync@2.2.0 push -u "$HOST_URL" -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"

    # Obtain an admin access token
    TOKEN=$(curl -s -X POST -d "email=$ADMIN_EMAIL&password=$ADMIN_PASSWORD" \
      "$HOST_URL/auth/login" | jq -r '.data.access_token')

    # Check if DEMO_MODE is enabled
    if [ "$DEMO_MODE" = "true" ]; then
        echo "Demo mode is enabled, setting initial user role to 'demo'"

        DEMO_ROLE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
                  "$HOST_URL/roles?fields=id&filter[name][_eq]=DemoUser")

        DEMO_ROLE_ID=$(echo "$DEMO_ROLE_RESPONSE" | jq -r '.data[0].id')

        if [ -z "$DEMO_ROLE_ID" ] || [ "$DEMO_ROLE_ID" = "null" ]; then
            echo "Demo role 'DemoUser' not found. Please ensure the role exists."
            exit 1
        fi

        echo "Demo role ID: $DEMO_ROLE_ID"
        # do a patch  call on {{root}}/settings with
        # {
        #     "public_registration_role": "role_id"
        # }
        curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
          -d "{\"public_registration_role\": \"$DEMO_ROLE_ID\"}" \
          "$HOST_URL/settings"
    else
        MEMBER_ROLE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
                  "$HOST_URL/roles?fields=id&filter[name][_eq]=Member")

        MEMBER_ROLE_ID=$(echo "$MEMBER_ROLE_RESPONSE" | jq -r '.data[0].id')

        if [ -z "$MEMBER_ROLE_ID" ] || [ "$MEMBER_ROLE_ID" = "null" ]; then
            echo "Role 'Member' not found. Please ensure the role exists."
            exit 1
        fi

        echo "Member role ID: $MEMBER_ROLE_ID"
        # do a patch  call on {{root}}/settings with
        # {
        #     "public_registration_role": "role_id"
        # }
        curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
          -d "{\"public_registration_role\": \"$MEMBER_ROLE_ID\"}" \
          "$HOST_URL/settings"
    fi

    echo "Initialization complete."
else
    echo "Initialization already done, skipping."
fi
