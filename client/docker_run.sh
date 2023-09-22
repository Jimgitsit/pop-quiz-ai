#!/bin/bash
docker run --name pop-quiz-ai-client --env-file .env.local -p 3001:3001 pop-quiz-ai-client