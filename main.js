// API key and Secret key
const key = "X36ZOwMdQHQULSUcBHhOE27bY9uyL5NDYpAAVq3KehhZdAX8bt";
const secretKey = "bGrEU0kTzrrUPrycDWXj4NQgwWon4CPgoGkHqlOB";

// valid zipcode must equal 5 numbers
const validZip = /^\d{5}$/;

let token;
// get the token first
fetch("https://api.petfinder.com/v2/oauth2/token", {
  body: `grant_type=client_credentials&client_id=${key}&client_secret=${secretKey}`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  method: "POST"
})
  .then(response => response.json())
  .then(data => {
    token = data.access_token;
  });

// Access the form
const petForm = document.getElementById('pet-form');
// Access error
const error = document.getElementById('error');
// Access results
const results = document.getElementById('results');

// Functions

// Update UI
function updateUI(animalInfo) {
  results.innerHTML = '<div></div>';
  animalInfo.forEach(animal => {

   // let noPhoto = '<img src="assets/pet-photo-shoot.jpeg">'
   let image; 
   //console.log(animal.photos[0].medium);
   if (animal.photos.length > 0) {
     image = animal.photos[0].medium;
   } else {
     image = "./assets/pet-photo-shoot.jpeg"
   }
    results.innerHTML += `
 <div class="card mb-3 shadow p-3 mb-5 mb-5">
   <div class="row g-0">
     <div class="col-md-4">
      <img  class="img-fluid rounded-start" id="image" src="${image}" alt="Animal Photo">
     </div>
      <div class="col-md-8">
        <div class="card-body">
        <h4 class="card-title fw-bold">${animal.name},  (${animal.age})</h4>
        <p class="text-secondary">${animal.breeds.primary}, (${animal.gender})</p>
        <p>${animal.contact.address.address1 ? `${animal.contact.address.address1}, `
        :``
      } ${animal.contact.address.city}, ${animal.contact.address.state} ${animal.contact.address.postcode}</p>
        <ul class="list-group">
        ${animal.contact.phone ?` <li class="list-group-item">Phone: ${animal.contact.phone}</li>` : `` }
       ${animal.contact.email ?`<li class="list-group-item">Email: ${animal.contact.email}</li>` : ``}
        <li class="list-group-item">Shelter ID: ${animal.organization_id}</li>
      </ul>
    </div>
     
     </div>
    </div>
    
    <div class="accordion" id="chapters">
    <div class="accordion-item">
      <h2 class="accordion-header" id="heading-1">
      <button style="background-color:#aa6820 color: white" class="accordion-button btn btn-dark" type="button" data-bs-toggle="collapse" data-bs-target="#chapter-1" aria-expanded="false" aria-controls="chapter-1">Learn more about ${animal.name}.</button></h2>

        <div id="chapter-1" class="accordion-collapse collapse" aria-labelledby="heading-1" data-bs-parent="#chapters">
          <div class="accordion-body">
          <h4>${animal.name}'s Description</h4>    
          ${animal.description ?`<p>${animal.description}</p>` : `<p>${animal.name} is available for adoption.</p>`}

          <h4>${animal.name}'s Attributes</h4>  
            <ul class="list-group">
            <li class="list-group-item">Declawed: ${animal.attributes.declawed ? 'Yes' : 'No'}</li>
            <li class="list-group-item">House trained: ${animal.attributes.house_trained ? 'Yes' : 'No'}</li>
            <li class="list-group-item">Shots Current: ${animal.attributes.shots_current ? 'Yes' : 'No'}</li>
            <li class="list-group-item">Spayed/Neutered: ${animal.attributes.spayed_neutered ? 'Yes' : 'No'}</li>
            <li class="list-group-item">Special Needs: ${animal.attributes.special_needs ? 'Yes' : 'No'}</li>
            </ul>
            <a href="${animal.url}" target="_blank" rel="nopener noreferrer"><img src="assets/Adopt-Me-Button.png" id="adopt-me"></a>
          </div>
        </div>
      </div>  
    </div> 
    
  </div>


    </div>


    `;
  });
}

// Fetch animals from the API
function fetchAnimals(animal, zip) {
  // fetch pets
  // get data using the token
  fetch(`https://api.petfinder.com/v2/animals?type=${animal}&location=${zip}&callback=callback`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
        console.log(data);
      updateUI(data.animals);
    });
}

// Add event listener
// check if the zip code is valid
petForm.addEventListener('submit', e => {
  // since we are adding an event listener on a submit event we are adding the preventDefault()
  // to avoid the form from submitting to a backend page
  e.preventDefault();
  // Access user input
  const animal = document.getElementById('animal').value;
  const zip = document.getElementById('zip').value;
    if (validZip.test(zip)) {
    setTimeout(() => {
      fetchAnimals(animal, zip);
    }, 2000);
  } else {
    error.textContent = '(Enter a valid zip code)';
    error.style.color = 'tomato';
    setTimeout(() => {
      error.textContent = '';
    }, 1000);
  }
});
