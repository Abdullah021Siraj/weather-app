Here’s a polished, professional version of your README tailored for recruiters and developers:

---

# 🌦️ Weather Dashboard (Next.js + TypeScript)  

**A modern, real-time weather application** built with Next.js (App Router), TypeScript, and Tailwind CSS, featuring a responsive UI powered by shadcn/ui. Leverages the OpenWeatherMap API for accurate weather data and supports dual deployment via Vercel (CI/CD) and AWS EC2.  

![Weather App Screenshot](/public/weather-app.png)  

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://your-vercel-link.vercel.app)  
[![AWS EC2 Hosting](https://img.shields.io/badge/AWS-EC2-orange?style=flat&logo=amazonaws)](http://your-ec2-ip:3000)  

---

## ✨ **Key Features**  
✅ **Real-time weather data** by city or geographic coordinates  
✅ **Type-safe codebase** with TypeScript for robust development  
✅ **Responsive UI** built with Tailwind CSS and shadcn/ui components  
✅ **Dual deployment** (Vercel + AWS EC2) for redundancy and scalability  
✅ **Automated CI/CD** via GitHub Actions (Vercel)  
✅ **Production-ready** with PM2 process management (EC2)  

---

## 🛠️ **Development Setup**  

### **Prerequisites**  
- Node.js ≥18.x  
- OpenWeatherMap API key ([Sign up here](https://openweathermap.org/api))  

### **Local Installation**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-repo/weather-app.git && cd weather-app
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Configure environment variables (create `.env`):  
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```  
4. Start the development server:  
   ```bash
   npm run dev
   ```  
   Access the app at: `http://localhost:3000`  

---

## 🚀 **Deployment**  

### **1. Vercel (Recommended)**  
- **Automated deployment** on `git push` to `main` branch.  
- Environment variables are managed via Vercel Dashboard.  

### **2. AWS EC2 (Self-Hosted)**  
1. **SSH into EC2 instance** (Amazon Linux 2):  
   ```bash
   ssh -i "your-key.pem" ec2-user@<EC2_PUBLIC_IP>
   ```  
2. **Install Node.js** using NVM:  
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   nvm install 18
   ```  
3. **Clone, build, and run** with PM2:  
   ```bash
   git clone https://github.com/your-repo/weather-app.git
   cd weather-app
   npm install && npm run build
   pm2 start npm --name "weather-app" -- start
   ```  
    ![PM2 Preview](/public/pm2-running.png)

4. **Configure security groups** to expose port `3000`.  

---

## ⚙️ **Technical Details**  

### **Environment Variables**  
| Variable                        | Required | Description                          |  
|---------------------------------|----------|--------------------------------------|  
| `NEXT_PUBLIC_WEATHER_API_KEY` | Yes      | OpenWeatherMap API key               |  

### **CI/CD Pipeline**  
- GitHub Actions workflow (`.github/workflows/deploy.yml`) automates Vercel deployments on `main` branch pushes.  

---

## 🔍 **Troubleshooting**  

| Issue                          | Solution                                  |  
|--------------------------------|-------------------------------------------|  
| **PM2 crashes**                | Check logs: `pm2 logs weather-app`        |  
| **Port 3000 busy**             | Kill process: `kill -9 $(lsof -t -i:3000)` |  
| **Missing environment variables** | Ensure `.env` is copied to EC2 or passed to PM2 |  

---

## 📸 **UI Preview**  

| Mobile View (375px)          | Desktop View (1440px)         |  
|------------------------------|-------------------------------|  
| ![Mobile](/public/mobile-preview.jpeg) | ![Desktop](/public/preview.png)|  

---

## 📜 **License**  
MIT © [Your Name].  
For inquiries, contact: [your.email@example.com](mailto:your.email@example.com)  

---

### **Notes for Customization**  
1. Replace placeholder images (`screenshot.png`, `mobile.png`, `desktop.png`).  
2. Update `your-repo`, `your_api_key_here`, and `<EC2_PUBLIC_IP>`.  
3. Add badges (e.g., build status, coverage) if applicable.  

This version emphasizes **clarity, professionalism, and technical depth** while maintaining readability. Let me know if you'd like further refinements! 🚀