# path=readlink -f $0
# chmod +x $path
# chmod +x package.sh

echo "Installing package management software..."
if [ "$(uname)" == "Darwin" ]; then  # macOS
    echo "Detected macOS."

    # Install Homebrew
    if command -v brew &> /dev/null; then
        echo "Homebrew is already installed. Skipping installation."
    else
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    fi

    # Install Node.js
    if command -v node &> /dev/null; then
        echo "Node.js is already installed. Skipping installation."
    else
        echo "Installing Node.js..."
        brew install node
    fi
elif [ "$(uname -s)" == "Windows_NT" ]; then  # Windows
    echo "Detected Windows."

    # Install Chocolatey with Windows Package Manager
    if Get-Command choco -ErrorAction SilentlyContinue; then
        echo "Chocolatey is already installed. Skipping installation."
    else
        echo "Installing Chocolatey..."
        winget install -e --id=chocolatey.chocolatey
    fi
    
    # Install Node.js
    if Get-Command node -ErrorAction SilentlyContinue; then
        echo "Node.js is already installed. Skipping installation."
    else
        echo "Installing Node.js..."
        choco install nodejs
    fi

    # Install Node Package Manager
    if Get-Command npm -ErrorAction SilentlyContinue; then
        echo "Node Package Manager is already installed. Skipping installation."
    else
        echo "Installing Node Package Manager..."
        choco install npm
    fi

    # Install Expo CLI globally with npm
    if Get-Command expo -ErrorAction SilentlyContinue; then
        echo "Expo CLI is already installed. Skipping installation."
    else
        echo "Installing Expo CLI..."
        npm install -g expo-cli
    fi

    # Install Yarn with npm
    if Get-Command yarn -ErrorAction SilentlyContinue; then
        echo "Yarn is already installed. Skipping installation."
    else
        echo "Installing Yarn..."
        npm install -g yarn
    fi
elif [ "$(uname -s)" == "Linux" ]; then  # Linux
    echo "Detected Linux."
    
    # Install Node.js
    if command -v node &> /dev/null; then
        echo "Node.js is already installed. Skipping installation."
    else
        echo "Installing Node.js..."
        pacman -S nodejs
    fi
else
    echo "Did not detect a supported operating system."
    echo "Please install software manually or reach out to the CTO for assistance."
fi

# Common installation steps for macOS and Linux
if [ "$(uname)" == "Darwin" ] || [ "$(uname -s)" == "Linux" ]; then
    # Install Node Version Manager (nvm)
    if command -v nvm &> /dev/null; then
        echo "Node Version Manager is already installed. Skipping installation."
    else
        echo "Installing Node Version Manager..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    fi

    # Install Node Package Manager (npm) with nvm
    if command -v npm &> /dev/null; then
        echo "Node Package Manager is already installed. Skipping installation."
    else
        echo "Installing Node Package Manager..."
        nvm install node
    fi

    # Install Expo CLI globally with npm
    if command -v expo &> /dev/null; then
        echo "Expo CLI is already installed. Skipping installation."
    else
        echo "Installing Expo CLI..."
        npm install -g expo-cli
    fi

    # Install Yarn with npm
    if command -v yarn &> /dev/null; then
        echo "Yarn is already installed. Skipping installation."
    else
        echo "Installing Yarn..."
        npm install -g yarn
    fi
fi

# Check for errors
if [ $? -eq 0 ]; then
    echo "Installation completed successfully."
    
    # Next steps
    echo "To start developing, clone the project to your local machine with the following command:"
    echo ""
    echo "git clone https://github.com/TheStanfordDaily/stanforddaily-mobile.git -b dev"
    echo ""
    echo "Then open the folder in your text editor of choice."
    echo "Enter the repository directory with cd stanforddaily-mobile and run \"yarn\" to install project dependencies."
    echo "Finally, run \"expo start\" to start the development server and follow the prompts to run the app on a simulator or device."
else
    echo "Installation failed."
fi