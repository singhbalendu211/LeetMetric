



document.addEventListener("DOMContentLoaded", function () {

    const searchBtn = document.getElementById("search-btn");
    const userInput = document.getElementById("user-input");


    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const medProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-card")

    function validateUsername(username) {


        if (username.trim() === "") {
            alert("Username should not be empty.")
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;

    }

   async function fetchUserDetails(username) {
    try {
        searchBtn.textContent = "Searching...";
        searchBtn.disabled = true;
        statsContainer.style.display="none";

        const graphqlQuery = {
            query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                            totalSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `,
            variables: { username: username }
        };

        const response = await fetch('http://localhost:4000/leetcode', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(graphqlQuery)
        });

        if (!response.ok) {
            throw new Error("Unable to fetch user details");
        }

        const parsedData = await response.json();
        console.log(" Logging User data:", parsedData);

        displayUserData(parsedData);

        // TODO: Process and display `data` as needed

    } catch (error) {
        console.error(error);
        statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
        searchBtn.textContent = "Search";
        searchBtn.disabled = false;
        statsContainer.style.display="block";
    }
}

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;

    }


    function displayUserData(parsedData){
        const totalQues= parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues= parsedData.data.allQuestionsCount[1].count;
        const totalMedQues= parsedData.data.allQuestionsCount[2].count;
        const totalHardQues= parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMedQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle );
        updateProgress(solvedMedQues, totalMedQues, mediumLabel, medProgressCircle );
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle );

        const cardsData = [
            {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];

        console.log(" Card Data : ", cardsData);

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")
        


    }


    searchBtn.addEventListener('click', function () {
        const username = userInput.value;
        console.log("username :", username);

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }

    })

});



