const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Middleware to parse JSON payloads
app.use(express.json());

app.post('/webhook', (req, res) => {
    const payload = req.body;

    // Ensure it's a push event on the main branch
    if (payload.ref === 'refs/heads/main') {
        console.log('Changes detected on main branch, pulling latest code...');
        exec('git pull origin main && pm2 restart your-app-name', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send('Error occurred.');
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
            res.status(200).send('Code pulled and server restarted.');
        });
    } else {
        res.status(200).send('Not a main branch push.');
    }
});

app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});
