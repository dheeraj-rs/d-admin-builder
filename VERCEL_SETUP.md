# Environment Variables Setup for Vercel

This guide will help you configure environment variables for your Vercel deployment.

## Required Environment Variables

Your application requires the following API keys to function:

1. **ANTHROPIC_API_KEY** - For Claude AI (Anthropic)
2. **GOOGLE_GENERATIVE_AI_API_KEY** - For Gemini AI (Google)

## Setup Instructions

### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `d-admin-builder`

2. **Navigate to Settings**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Environment Variables**

   Add the following variables one by one:

   **Variable 1:**

   ```
   Name: ANTHROPIC_API_KEY
   Value: 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
   Environment: Production, Preview, Development (select all)
   ```

   **Variable 2:**

   ```
   Name: GOOGLE_GENERATIVE_AI_API_KEY
   Value: AIzaSyD0wvLhK-b-eSK5jS6whYhqRSUX4dY5Kdg
   Environment: Production, Preview, Development (select all)
   ```

4. **Save and Redeploy**
   - Click **Save** for each variable
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

### Option 2: Using Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add ANTHROPIC_API_KEY
# Paste your key when prompted: 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
# Select: Production, Preview, Development

vercel env add GOOGLE_GENERATIVE_AI_API_KEY
# Paste your key when prompted: AIzaSyD0wvLhK-b-eSK5jS6whYhqRSUX4dY5Kdg
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

## Verification

After setting up environment variables and redeploying:

1. **Check Deployment Logs**
   - Go to your deployment in Vercel
   - Click on **Functions** tab
   - Look for logs showing:
     - `[streamText] Anthropic API key found` ✅
     - `[streamText] Google API key found` ✅

2. **Test the Application**
   - Visit your deployed URL
   - Try sending a chat message
   - It should work without the 500 error

## Troubleshooting

### Still getting 500 errors?

1. **Verify variables are set correctly**

   ```bash
   vercel env ls
   ```

2. **Check for typos in variable names**
   - Must be exactly: `ANTHROPIC_API_KEY`
   - Must be exactly: `GOOGLE_GENERATIVE_AI_API_KEY`

3. **Ensure all environments are selected**
   - Production ✓
   - Preview ✓
   - Development ✓

4. **Force a new deployment**
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push origin main
   ```

### Check API Key Validity

Test your API keys locally first:

```bash
# Test locally
npm run dev

# Open http://localhost:5173
# Try sending a message
```

If it works locally but not on Vercel, the issue is definitely with environment variables in Vercel.

## Security Notes

⚠️ **Important:**

- Never commit `.env.local` to git
- The `.env.example` file should NOT contain real API keys
- Keep your API keys secure and rotate them if exposed

## Need Help?

If you're still experiencing issues after following these steps:

1. Check the Vercel function logs for specific error messages
2. Verify your API keys are still valid
3. Ensure you've redeployed after adding environment variables
