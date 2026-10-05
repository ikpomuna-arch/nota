#!/bin/bash

# Nota APK Build Script
# This script builds the Android APK locally without needing Android Studio

echo "🚀 Building Nota APK..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Expo CLI globally
echo "📦 Installing Expo CLI..."
npm install -g eas-cli expo-cli

# Prebuild the Android project
echo "🔨 Prebuilding Android project..."
npx expo prebuild --platform android --clean --yes

# Check if Android SDK is available
if [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "⚠️  ANDROID_SDK_ROOT not set. Setting to default location..."
    export ANDROID_SDK_ROOT="$HOME/Android/sdk"
fi

# Build the APK using Gradle
echo "🔨 Building APK with Gradle..."
cd android
chmod +x gradlew
./gradlew assembleRelease
cd ..

# Check if build was successful
if [ $? -eq 0 ]; then
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        echo "✅ APK built successfully!"
        echo "📍 Location: $APK_PATH"
        echo "📊 Size: $(du -h $APK_PATH | cut -f1)"
        echo ""
        echo "🎉 Ready to install on Android device!"
        exit 0
    fi
fi

echo "❌ APK build failed. Check the output above for errors."
exit 1
