#!/bin/bash
docker run --name pop-quiz-ai-server --env-file .env -p 3000:3000 pop-quiz-ai-server