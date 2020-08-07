
# Example Chaos Squirrel Demo

**To start the server:**
* `npm install`
* `npm run start`

**To interact / trigger the chaos, and view CPU usage:**
* `curl -o - http://127.0.0.1:3000/` (node server will output a `PID`)
* `ps -p YOUR-PID-HERE -o %cpu,%mem`
