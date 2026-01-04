# 🌙 Hougetsu (抱月)
**Hougetsu** ：Hougetsu is an AI-powered reader for novels, news, and more. It helps you read stories in other languages without barriers by using AI to provide accurate translations and detailed explanations.
## How to use 
You can run Hougetsu in a local environment. Follow these steps to set up and run the project:
### Step 1: Prepare your computer
Make sure you have these installed:
* **Node.js** >24.10.0
* **Git**
* **Python**>3.12.2
### Step 2: Clone the Code and Install Dependencies
clone the repository:
```bash
git clone https://github.com/dafeiju111/hougetsu.git
```

Navigate to the hougetsu folder (ensure the package.json file is present in this directory):
```bash
cd hougetsu
```

Install the project dependencies:
```bash
npm install
```
### Step 3: create environment Variables
1. **Create the file**: In the main folder (root directory), create a new file named `.env.local`.
2. **Add your keys**: Copy and paste the following code into that file, and replace the placeholder with your actual API key:

**file: .env.local**
```env
NEXT_PUBLIC_TRANSLATION_MODEL = deepseek
DEEPSEEK_API_KEY = your_actual_api_key_here 
```
Currently, Hougetsu only supports the DeepSeek model, but you can modify the source code to integrate other model APIs.

### Step 4: Start Hougetsu Locally
Run the following command to start the development server:
```bash
npm run dev
```

## UI Display
<img width="1644" height="811" alt="image" src="https://github.com/user-attachments/assets/78d862fe-5a6b-42d1-b043-00d2a2172ea7" />
<img width="1658" height="822" alt="image" src="https://github.com/user-attachments/assets/e963d5b9-12e7-461a-be41-26dbf52cd54c" />

You can preview the interface here:https://hougetsu.vercel.app/

Note: This link is for UI layout demonstration only， translation and analysis features are disabled.


