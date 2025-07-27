(function () {
    // Initialize Lucide icons when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        lucide.createIcons();

      
        let messages = [
            {
                id: 1,
                text: "Hi there! I’m Ashesh Singh’s Resume Assistant. Ask me anything about his skills, projects, or education",
                isBot: true,
                timestamp: new Date()
            }
        ];
        let isTyping = false;
        // Variables for word-by-word typing
        let typingInterval = null;
        let currentBotMessageElement = null;
        let currentBotMessageWords = [];
        let currentBotMessageIndex = 0;

      
        const messagesContainer = document.getElementById('messages-container');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const suggestionButtons = document.querySelectorAll('.suggestion-btn');

        
        const resumeData = {
            name: "Ashesh Singh",
            title: "B.Tech Final Year CSE Student (Data Science)",
            contact: {
                Linkedin: "asheshsingh01",
                Github: "Ashesh88",
                email: "asheshsingh@gmail.com",
                location: "Noida, India"
            },
            summary: "Enthusiastic Computer Science student specializing in Data Science, with strong foundations in Python, SQL, Excel, and data visualization. Experienced in building dashboards, Websites, chatbots, and analytics projects using real-world datasets.",
            projects: [
                {
                    name: "RBS Furniture Website",
                    description: "Developed a responsive business website for RBS Furniture using HTML, Tailwind CSS, and JavaScript. Showcased products, business information, and contact options to improve digital presence.",
                    techStack: ["HTML", "Tailwind CSS", "JavaScript"]
                },
                {
                    name: "Resume Chatbot",
                    description: "Built an interactive chatbot that answers questions about my resume using JavaScript and Lucide icons. Enhances user engagement by presenting resume content in a conversational UI.",
                    techStack: ["HTML", "Tailwind CSS", "JavaScript", "Lucide Icons"]
                },
                {
                    name: "Portfolio Website",
                    description: "Created a clean and modern portfolio site to display my projects, skills, and contact details. Emphasized responsive design and user-friendly layout using Tailwind CSS.",
                    techStack: ["HTML", "Tailwind CSS", "JavaScript"]
                },
                {
                    name: "Sales Dashboard",
                    description: "Designed a Power BI dashboard to visualize sales KPIs including revenue, top products, and regional performance. Used Excel for data cleaning and DAX for custom metrics.",
                    techStack: ["Power BI", "Excel", "Python"]
                }
            ],
            education: [
                {
                    institution: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
                    degree: "B.Tech in Computer Science & Engineering (Data Science)",
                    year: "2021 - 2026"
                }
            ],
            skills: ["Python", "Pandas", "Numpy", "Java", "SQL", "Power BI", "Excel", "Tailwind CSS", "JavaScript", "GitHub", "HTML", "React (Basic)"],
            // Use 'certificate' (plural) for the data array
            certificate: [
                "Completed Google Data Analytics Professional Certificate",
                "Built and deployed Resume Chatbot Website",
                "Created a responsive Portfolio Website",
                "Developed the RBS Furniture Website",
                "Analyzed HR and Healthcare datasets using machine learning techniques",
                "Created and published dashboards using Power BI and Excel"
            ]
        };

        
        const botResponses = {
            greeting: "Hello! I'm here to help you learn about Ashesh Singh's professional background. You can ask me about his work projects, education, skills, contact.",
            project: `Developed the RBS Furniture website for a local business, built a fully interactive Resume Chatbot, designed a personal Portfolio Website using HTML and Tailwind CSS, and created a Sales Dashboard with Power BI to visualize real-time business insights.`,
            education: `Ashesh is pursuing his B.Tech in Computer Science and Engineering (Data Science) from Dr. A.P.J. Abdul Kalam Technical University, expected to graduate in 2026.`,
            skills: `Ashesh's technical skills include: ${resumeData.skills.join(', ')}. He's especially confident with Python, SQL, Power BI, and frontend web development.`,
            // Fix the certificate response: Use 'certificate' key, correct join with newlines
            certificate: `Some of Ashesh's notable certificate include:\n${resumeData.certificate.join('\n')}`,
            contact: `You can reach Ashesh at:\n📧 ${resumeData.contact.email}\n📍 ${resumeData.contact.location}\n🔗 LinkedIn: https://www.linkedin.com/in/${resumeData.contact.Linkedin}\n💻 GitHub: https://github.com/${resumeData.contact.Github}`,
            default: "I didn’t get that. Try asking about Ashesh's skills, resume, or projects!"
        };

       
        function formatTime(date) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        function scrollToBottom() {
            // Scroll smoothly to the bottom or the typing indicator
            const typingIndicator = document.getElementById('typing-indicator');
            const targetElement = typingIndicator || messagesContainer;
            targetElement.scrollIntoView({ behavior: "smooth", block: "end" });
        }

       
       
        function getBotResponse(userMessage) {
            const message = userMessage.toLowerCase();
            if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
                return botResponses.greeting;
            } else if (message.includes('projects') || message.includes('work') || message.includes('project')) {
                return botResponses.project;
            } else if (message.includes('education') || message.includes('study') || message.includes('school')) {
                return botResponses.education;
            } else if (message.includes('skill') || message.includes('tech')) {
                return botResponses.skills;
            }
         
            else if (message.includes('certificate') || message.includes('certificate') || message.includes('award')) {
                return botResponses.certificate; // Return the correctly formatted certificate response
            } else if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('links') || message.includes('linkedin') || message.includes('github')) {
                // Handle requests for links/contact info
                return botResponses.contact;
            } else {
                return botResponses.default;
            }
        }


     

      
        function startWordTypingAnimation(text) {
            // Clear any existing typing interval
            if (typingInterval) {
                clearInterval(typingInterval);
                typingInterval = null;
            }

         
            currentBotMessageWords = text.split(/(\n)/).filter(part => part !== '').flatMap(part => part === '\n' ? ['\n'] : part.split(' '));
            currentBotMessageIndex = 0;

            // Create new bot message element container
            const messageDiv = document.createElement('div');
            messageDiv.className = 'flex justify-start';
            messageDiv.id = 'typing-message-container'; // Give it an ID for easier management

            messageDiv.innerHTML = `
                <div class="flex items-start space-x-2 max-w-xs lg:max-w-md">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600">
                        <i data-lucide="bot" class="w-4 h-4 text-white"></i>
                    </div>
                    <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2">
                        <p class="text-sm" id="typing-text"></p>
                        <p class="text-xs mt-1 text-gray-500">${formatTime(new Date())}</p>
                    </div>
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
            lucide.createIcons();
            scrollToBottom();

         
            currentBotMessageElement = document.getElementById('typing-text');

           
            typingInterval = setInterval(() => {
                if (currentBotMessageIndex < currentBotMessageWords.length) {
                    const word = currentBotMessageWords[currentBotMessageIndex];
                    if (word === '\n') {
                        currentBotMessageElement.innerHTML += '<br>';
                    } else {
                        // Add space before the word if it's not the first word and the last character isn't already a line break
                        const addSpace = currentBotMessageElement.innerHTML && !currentBotMessageElement.innerHTML.endsWith('<br>') ? ' ' : '';
                        currentBotMessageElement.innerHTML += `${addSpace}${word}`;
                    }
                    currentBotMessageIndex++;
                    scrollToBottom(); // Keep scrolling as text appears
                } else {
                    clearInterval(typingInterval);
                    typingInterval = null;
                    currentBotMessageElement = null;
                    currentBotMessageWords = [];
                    currentBotMessageIndex = 0;
                    // Remove the temporary ID
                    const container = document.getElementById('typing-message-container');
                    if (container) {
                         container.removeAttribute('id');
                    }
                   
                    lucide.createIcons();
                }
            }, 70); // Adjust typing speed here (milliseconds per word part)
        }

       
        function renderMessages() {
            messagesContainer.innerHTML = ''; // Clear existing messages
            messages.forEach(message => {
              
                if (!message.isBot || message.id === 1) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `flex ${message.isBot ? 'justify-start' : 'justify-end'}`;

                    const timestamp = message.timestamp;

                    messageDiv.innerHTML = `
                        <div class="flex items-start space-x-2 max-w-xs lg:max-w-md ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isBot ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'}">
                                ${message.isBot ?
                                    '<i data-lucide="bot" class="w-4 h-4 text-white"></i>' :
                                    '<i data-lucide="user" class="w-4 h-4 text-gray-600"></i>'
                                }
                            </div>
                            <div class="rounded-2xl px-4 py-2 ${message.isBot ? 'bg-gray-100 text-gray-900 rounded-tl-sm' : 'bg-blue-500 text-white rounded-tr-sm'}">
                                <p class="text-sm">${message.text.replace(/\n/g, '<br>')}</p>
                                <p class="text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}">${formatTime(timestamp)}</p>
                            </div>
                        </div>
                    `;

                    messagesContainer.appendChild(messageDiv);
                }
            });

           
            lucide.createIcons();
            scrollToBottom();
        }

      
        function addMessage(text, isBot) {
            const newMessage = {
                id: Date.now() + Math.random(), // Simple ID generation
                text: text,
                isBot: isBot,
                timestamp: new Date()
            };
            messages.push(newMessage);

            if (isBot) {
                // For bot messages, start the typing animation
                startWordTypingAnimation(text);
            } else {
                // For user messages, render immediately
                renderMessages();
            }
        }

        function showTypingIndicator() {
            isTyping = true;
            const typingDiv = document.createElement('div');
            typingDiv.className = 'flex justify-start';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="flex items-start space-x-2 max-w-xs lg:max-w-md">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i data-lucide="bot" class="w-4 h-4 text-white"></i>
                    </div>
                    <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.1s;"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.2s;"></div>
                        </div>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            lucide.createIcons();
            scrollToBottom();
        }

        function hideTypingIndicator() {
            isTyping = false;
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

       
        function handleSendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            addMessage(message, false); // Add user message
            messageInput.value = '';
            sendButton.disabled = true;

            showTypingIndicator();

            setTimeout(() => {
                hideTypingIndicator();
                const botResponse = getBotResponse(message);
                addMessage(botResponse, true); // Add bot response (will be typed)
            }, 1000 + Math.random() * 1000);
        }

        function handleSuggestionClick(event) {
            const text = event.target.getAttribute('data-text');
            messageInput.value = text;
            messageInput.focus();
            sendButton.disabled = false;
        }

      
        renderMessages(); // Render initial messages

        
        sendButton.addEventListener('click', handleSendMessage);

        messageInput.addEventListener('input', () => {
            sendButton.disabled = !messageInput.value.trim();
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        suggestionButtons.forEach(button => {
            button.addEventListener('click', handleSuggestionClick);
        });

      
        scrollToBottom();
    });
})();
