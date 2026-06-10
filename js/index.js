const body = document.body;
const footer = document.createElement('footer');
body.appendChild(footer);

const today = new Date();
const thisYear = today.getFullYear();
const copyright = document.createElement('p');
copyright.innerHTML = `\u00A9 ${thisYear} J-D Laurence`;
footer.appendChild(copyright);

const skills = ['HTML', 'CSS', 'JavaScript', 'Python', 'Git', 'SQL', 'C++', 'Java'];
const skillsSection = document.querySelector('#Skills');
const skillsList = skillsSection.querySelector('ul');

for (let i = 0; i < skills.length; i++) {
    const skill = document.createElement('li');
    skill.innerText = skills[i];
    skillsList.appendChild(skill);
}

const messageForm = document.querySelector('[name="leave_message"]');
messageForm.addEventListener('submit', function(event){
    event.preventDefault(); //this stops the page refreshing
    const usersName = event.target.usersName.value;
    const usersEmail = event.target.usersEmail.value;
    const usersMessage = event.target.usersMessage.value;
    console.log(usersName, usersEmail, usersMessage);
    
    const messageSection = document.querySelector('#messages');
    const messageList = messageSection.querySelector('ul');
    const newMessage = document.createElement('li');
    newMessage.innerHTML = `<a href="mailto:${usersEmail}">${usersName}</a>
                            <span>${usersMessage}</span>`;
    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.type = 'button'; //otherwise it will be a submit by default 
    removeButton.addEventListener('click', function(event){
        const entry = event.target.parentNode;
        entry.remove();
    })
    newMessage.appendChild(removeButton);
    messageList.appendChild(newMessage);
    event.target.reset(); //this clears the form
})

//for my own understanding, fetch is an api built into the browser already
//and it returns a promise. When that promise is resolved, whatever 
//it resolves to is automatically passed to the .then() which is a method of
//of a Promise object. The .then() takes a function as an argument. We do not need to name this
//function as it is only used here, so it is anonymous, but we do define 
//what it does, and that is that this function takes as an input whatever the promise
//resolves to, and we are labelling that input "response" (although we could
//label it anything we want). And we are saying that it will return
// the .json() method of the response object, which in turn 
//is the promise that the fetch returned. The arrwo notation means "we are
//passing in a function and here is its definition"
// Also arrow notation on one line implies that the function is returning the value
//  of that line, so we do not need to write the return keyword.
//As soon as we use curly braces we need to specify the return keyword, if we 
//actually want it to return something other than "undefined"

let repositories; // we have to declare it here so we can use it later
let projectSection = document.querySelector('#Projects');
let projectList = projectSection.querySelector('ul');
fetch('https://api.github.com/users/j-dlaurence/repos')
// fetch('https://fake') //to test error handling
    .then(response => response.json())
    .then(data => {
        repositories = data;
        console.log(repositories);
        //loop needs to go in here otherwise it tries to run before
        //the repositories variable has been assigned from the fetch
        for (let i = 0; i < repositories.length; i++){
            let project = document.createElement('li');
            project.innerText = repositories[i].name;
            projectList.appendChild(project);
        }
    })
//since the first response.json() takes a while to do, the .then() that includes it 
//is essentially returning a promise - eventually the json will get there
//so we can chain the .then()s, and the next one takes that promise as an input
//
    .catch(error => {
        console.log("Something went wrong:", error);
        let errorMessage = document.createElement('p');
        errorMessage.innerText = "Error: Unable to load projects";
        projectSection.appendChild(errorMessage);
    })

