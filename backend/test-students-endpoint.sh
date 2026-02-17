#!/bin/bash

echo "🧪 Testing /Students/:id endpoint"
echo "=================================="
echo ""

# Step 1: Login as admin to get token and school ID
echo "1️⃣  Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST http://localhost:5000/AdminLogin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"admin123"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract school ID from response
SCHOOL_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.school // .user._id')
echo "📍 School ID: $SCHOOL_ID"
echo ""

# Step 2: Test the Students endpoint
echo "2️⃣  Fetching all students for school..."
STUDENTS_RESPONSE=$(curl -s -b cookies.txt -X GET "http://localhost:5000/Students/$SCHOOL_ID")

echo "Students Response:"
echo "$STUDENTS_RESPONSE" | jq '.'
echo ""

# Cleanup
rm -f cookies.txt

echo "✅ Test complete!"
