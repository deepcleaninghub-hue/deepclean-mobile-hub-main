# Deep Clean Hub - Mobile App

A React Native mobile application for Deep Clean Hub, a professional cleaning services company. This app provides a mobile-friendly interface for customers to browse services, contact the company, and learn more about the business.

## 🚀 Features

- **Home Screen**: Hero section with featured services and call-to-action
- **Services Screen**: Comprehensive list of all cleaning services with pricing and details
- **Contact Screen**: Contact form with validation and multiple contact methods
- **About Screen**: Company information, team details, and statistics
- **Bottom Tab Navigation**: Easy navigation between different sections
- **Responsive Design**: Optimized for both iOS and Android devices
- **Modern UI**: Built with React Native Paper and Material Design 3

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **UI Components**: React Native Paper
- **Navigation**: React Navigation 6
- **Icons**: Expo Vector Icons (Ionicons)
- **Forms**: React Hook Form with Zod validation
- **Styling**: StyleSheet with theme support
- **Gradients**: Expo Linear Gradient

## 📱 Screenshots

The app includes:
- Beautiful hero sections with gradient backgrounds
- Service cards with images and detailed information
- Contact forms with validation
- Team member profiles
- Statistics and company information
- Call-to-action buttons for phone, email, and WhatsApp

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Navigate to the mobile app directory**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## 📁 Project Structure

```
mobile-app/
├── App.tsx                    # Main app component
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── src/
    ├── components/            # Reusable UI components
    │   └── ServiceCard.tsx   # Service display component
    ├── navigation/            # Navigation configuration
    │   └── AppNavigator.tsx  # Main navigation setup
    ├── screens/               # Screen components
    │   ├── HomeScreen.tsx    # Home/landing page
    │   ├── ServicesScreen.tsx # Services listing
    │   ├── ContactScreen.tsx # Contact form
    │   └── AboutScreen.tsx   # About company
    └── utils/                 # Utility functions
        └── theme.ts           # App theme configuration
```

## 🎨 Theme & Styling

The app uses a custom theme based on Material Design 3 with:
- Primary colors: Blue (#2563eb)
- Secondary colors: Purple (#7c3aed)
- Tertiary colors: Green (#059669)
- Consistent spacing and typography
- Elevation and shadow effects
- Responsive design patterns

## 📱 Mobile-First Features

- **Touch-friendly buttons**: Large touch targets for mobile devices
- **Swipe gestures**: Smooth scrolling and navigation
- **Responsive layouts**: Adapts to different screen sizes
- **Native interactions**: Phone calls, emails, and WhatsApp integration
- **Keyboard handling**: Proper keyboard avoidance for forms

## 🔧 Customization

### Adding New Services
Edit the `services` array in `ServicesScreen.tsx` to add or modify services.

### Updating Contact Information
Modify contact details in the respective screen components.

### Changing Theme Colors
Update the color values in `src/utils/theme.ts`.

## 📱 Platform Support

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phone & Tablet)
- ✅ Web (Responsive web app)

## 🚀 Deployment

### Building for Production

1. **Configure app.json** with your app details
2. **Build the app**:
   ```bash
   expo build:android  # For Android
   expo build:ios      # For iOS
   ```

### App Store Deployment

- Follow Expo's deployment guide for iOS App Store
- Follow Expo's deployment guide for Google Play Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- Phone: +49-16097044182
- Email: info@deepcleaninghub.com
- WhatsApp: Available through the app

---

**Built with ❤️ using React Native and Expo**
