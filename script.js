
        // DOM Elements
        const openModalBtn = document.getElementById('openModal');
        const homeModal = document.getElementById('homeModal');
        const closeModalBtn = document.getElementById('closeModal');
        const questionnaireContainer = document.getElementById('questionnaire-container');

        // Sample Matterport Homes Database
        const matterportHomes = [
            { id: "eD7WJxyZ7QK", title: "Modern Luxury Villa", style: "Modern", budget: "$600k+", sqft: 3500 },
            { id: "k9ZQ2bNc4Xz", title: "Traditional Family Home", style: "Traditional", budget: "$400k-$600k", sqft: 2800 },
            { id: "pL3mR8sT1vW", title: "Cozy Farmhouse", style: "Farmhouse", budget: "$200k-$400k", sqft: 1800 },
            { id: "aB5cD7eF9gH", title: "Contemporary Beach House", style: "Modern", budget: "$600k+", sqft: 3200 },
            { id: "xYz123abc456", title: "Classic Colonial", style: "Traditional", budget: "$400k-$600k", sqft: 2400 }
        ];

        // Questionnaire Data
        const questions = [
            {
                question: "What's your preferred home style?",
                options: ["Modern", "Traditional", "Farmhouse", "Luxury"],
                key: "style"
            },
            {
                question: "What's your budget range?",
                options: ["$200k-$400k", "$400k-$600k", "$600k+"],
                key: "budget"
            },
            {
                question: "What size home are you looking for?",
                options: ["Under 2,000 sqft", "2,000-3,000 sqft", "Over 3,000 sqft"],
                key: "sqft"
            }
        ];

        // User Answers
        let currentQuestion = 0;
        let userAnswers = {};

        // Event Listeners
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);

        // Functions
        function openModal() {
            homeModal.style.display = 'flex';
            startQuestionnaire();
        }

        function closeModal() {
            homeModal.style.display = 'none';
            resetQuestionnaire();
        }

        function startQuestionnaire() {
            currentQuestion = 0;
            userAnswers = {};
            showQuestion(currentQuestion);
        }

        function resetQuestionnaire() {
            currentQuestion = 0;
            userAnswers = {};
        }

        function showQuestion(index) {
            if (index >= questions.length) {
                showResults();
                return;
            }

            const question = questions[index];
            questionnaireContainer.innerHTML = `
                <div class="question-container">
                    <h3>${question.question}</h3>
                    <div class="options">
                        ${question.options.map(opt => `
                            <button class="option-btn" onclick="selectOption('${question.key}', '${opt}')">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div class="hourglass-loader" id="loader" style="display:none;"></div>
                </div>
            `;
        }

        function selectOption(key, value) {
            // Show loading spinner
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            // Save user answer
            userAnswers[key] = value;

            // Simulate processing delay
            setTimeout(() => {
                loader.style.display = 'none';
                currentQuestion++;
                showQuestion(currentQuestion);
            }, 800);
        }

        function showResults() {
            // Filter homes based on user answers
            const matchedHomes = matterportHomes.filter(home => {
                return (
                    (!userAnswers.style || home.style === userAnswers.style) &&
                    (!userAnswers.budget || home.budget === userAnswers.budget) &&
                    (
                        !userAnswers.sqft ||
                        (userAnswers.sqft === "Under 2,000 sqft" && home.sqft < 2000) ||
                        (userAnswers.sqft === "2,000-3,000 sqft" && home.sqft >= 2000 && home.sqft <= 3000) ||
                        (userAnswers.sqft === "Over 3,000 sqft" && home.sqft > 3000)
                    )
                );
            });

            // Display results
            questionnaireContainer.innerHTML = `
                <h2>Here Are Your Matched Home Designs</h2>
                <p>We found ${matchedHomes.length} home designs that match your preferences:</p>
                
                <div class="home-gallery">
                    ${matchedHomes.length > 0 ?
                    matchedHomes.map(home => `
                            <div class="home-card">
                                <h3>${home.title}</h3>
                                <p><strong>Style:</strong> ${home.style} | <strong>Size:</strong> ${home.sqft} sqft</p>
                                <div class="matterport-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                                    <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                                        src="https://my.matterport.com/show/?m=${home.id}" 
                                        frameborder="0" 
                                        allowfullscreen
                                        allow="xr-spatial-tracking">
                                    </iframe>
                                </div>
                                <button class="dream-home-btn" style="margin-top:15px;width:100%;" 
                                    onclick="selectHome('${home.id}')">
                                    Select This Design
                                </button>
                            </div>
                        `).join('')
                    :
                    '<p>No homes matched all your criteria. Try adjusting your preferences.</p>'
                }
                </div>
                
                <button class="dream-home-btn" style="margin-top:20px;" onclick="startQuestionnaire()">
                    Start Over
                </button>
            `;
        }

        function selectHome(homeId) {
            // Here you would typically send this selection to your server
            alert(`You selected home ${homeId}. This would connect to your contractor services.`);
            closeModal();
        }

        // Close modal when clicking outside content
        window.addEventListener('click', (event) => {
            if (event.target === homeModal) {
                closeModal();
            }
        });
    