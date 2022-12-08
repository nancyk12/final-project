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

    let image;
    if (animal.photos.length > 0) {
      image = animal.photos[0].medium;
    } else {
      image = "<a href='https://www.petfinder.com'><img src='https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59078164/1/?bust=1670408053&width=720' border='0' alt='This pet is preparing for their photo shoot! Pictures coming soon!' /></a>";
    }
    results.innerHTML += `
 <div class="card mb-3 shadow p-3 mb-5 mb-5">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${
        animal.photos[0] ? animal.photos[0].medium : ""
      }" class="img-fluid rounded-start" alt="animal-image">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h4 class="card-title fw-bold">${animal.name}  (${animal.age})</h4>
        <p class="text-secondary">${animal.breeds.primary}  (<i class="bi bi-gender-ambiguous"></i>${animal.gender})</p>
        <p>${animal.contact.address.address1}, ${animal.contact.address.city}, ${animal.contact.address.state} ${animal.contact.address.postcode}</p>
        <ul class="list-group">
        <li class="list-group-item">Phone: ${animal.contact.phone}</li> 
        ${animal.contact.email ? `<li class="List-group-item">Email: ${animal.contact.email}</li>` : ``}
        <li class="list-group-item">Shelter ID: ${animal.organization_id}</li>
      </ul>
    </div>
      </div>
    </div>
  </div>
</div>

      <br> 
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
    //results.innerHTML = '<div class="small"><iframe src="https://giphy.com/embed/lpOxKH3VWxTPi" width="100px" height="100px" frameBorder="0" class="giphy-embed"></iframe></div>';
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