#!/bin/bash

# Get a list of all test files
TEST_FILES=$(find ./tests -name "*.test.ts")

# Run the test command for each test file
for FILE in $TEST_FILES
do
  echo "Running tests in $FILE"
  npx jest --runInBand $FILE
done