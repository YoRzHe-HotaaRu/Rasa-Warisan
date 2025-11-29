# Rasa Warisan 🥘

**Rasa Warisan** (Legacy of Taste) is an AI-powered culinary historian designed to preserve and celebrate Malay traditional delicacies. 

Using advanced computer vision via the **Gemini 2.5 Flash API**, this application identifies traditional foods from images and generates a comprehensive "Food Identity Card" containing recipes, historical context, nutritional facts, and flavor profiles.

![App Screenshot](https://via.placeholder.com/1200x600?text=Rasa+Warisan+Preview)

## ✨ Features

- **📸 AI Vision Recognition**: Instantly identifies Malay Kuih, main dishes, and beverages.
- **📜 Culinary Storytelling**: Provides not just recipes, but the *history* and cultural significance of each dish.
- **📊 Interactive Statistics**: Visualizes your "Food Passport" with charts showing flavor profiles, calorie counts, and regional origins.
- **🥘 Recipe & Pairing**: detailed step-by-step cooking instructions and suggestions for the perfect drink pairing (e.g., Teh Tarik).
- **💾 Local Persistence**: Automatically saves your scan history to the browser's LocalStorage.

## 🛠️ Tech Stack

- **Framework**: React 19 (via CDN/ES Modules)
- **Styling**: Tailwind CSS (Utility-first masterpiece)
- **AI Model**: Google Gemini 2.5 Flash (`@google/genai` SDK)
- **Visualization**: Recharts (Radar, Pie, and Bar charts)
- **Icons**: Lucide React
- **Typography**: Playfair Display (Serif) & Inter (Sans-Serif)

## 🚀 Getting Started

### Prerequisites

1.  A modern web browser (Chrome, Edge, Firefox).
2.  A valid **Google Gemini API Key**. You can get one at [Google AI Studio](https://aistudio.google.com/).

### Installation

No complex build tools (Webpack/Vite) are strictly required for this version as it uses ES Modules via CDN, but for a standard development environment:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/rasa-warisan.git
    cd rasa-warisan
    ```

2.  **Set up Environment Variables**
    *   Create a `.env` file in the root.
    *   Add your API key:
        ```
        API_KEY=your_gemini_api_key_here
        ```
    *   *Note: If running in a simple static server environment without a build process, you may need to hardcode the key temporarily in `services/geminiService.ts` or use a proxy server for security.*

3.  **Run the Application**
    *   If using a bundler (Vite/CRA): `npm start` or `npm run dev`.
    *   If using the provided CDN structure: Serve the directory using a static server (e.g., Live Server in VS Code).

## 🎨 UI/UX Philosophy

The design language, **"Batik & Clay"**, avoids harsh gradients in favor of:
*   **Warm Earth Tones**: Stone (`#fafaf9`) and Amber (`#d97706`).
*   **Clean Typography**: High contrast between Serif headers and Sans-serif body text.
*   **Card Metaphor**: Information is presented in tangible, shadow-softened cards.

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License.

---

*"Biarpun jauh dimata, rasa tetap dijiwa."* (Though far from the eyes, the taste remains in the soul.)
